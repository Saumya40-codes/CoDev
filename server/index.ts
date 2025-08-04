import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import fs from 'fs';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { languageConfigs } from './controllers/codeConfig';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import pLimit from 'p-limit';
import helmet from 'helmet';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://co-dev-sigma.vercel.app'
    ],
  },
  execution: {
    timeout: parseInt(process.env.EXECUTION_TIMEOUT || '30000'),
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT || '5'),
    maxCodeSize: parseInt(process.env.MAX_CODE_SIZE || '10000'),
  },
  nextApiEndpoint: process.env.NEXT_API_ENDPOINT || 'http://localhost:3000/api',
};

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

interface ExecuteRequest {
  code: string;
  lang: keyof typeof languageConfigs;
}

interface SocketData {
  projectId: string;
  userId: string;
}

interface ProjectStateData {
  projectId: string;
  state: any;
}

interface CodeChangedData {
  projectId: string;
  fileId: string;
  content: string;
  userId: string;
}

const executeSchema = Joi.object({
  code: Joi.string().required().max(config.execution.maxCodeSize),
  lang: Joi.string().required().valid(...Object.keys(languageConfigs))
});

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({
  origin: config.cors.origins,
  credentials: true
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const executeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: { error: 'Too many code execution requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

const executionLimit = pLimit(config.execution.maxConcurrent);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.cors.origins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

io.on('connection', (socket: Socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join-project', (projectId: string, userId: string) => {
    try {
      if (!projectId || !userId) {
        socket.emit('error', { message: 'Project ID and User ID are required' });
        return;
      }

      socket.join(projectId);
      socket.data = { projectId, userId };
      socket.broadcast.to(projectId).emit('user-joined', { userId });
      
      logger.info(`User ${userId} joined project ${projectId}`);
    } catch (error) {
      logger.error('Error in join-project:', error);
      socket.emit('error', { message: 'Failed to join project' });
    }
  });

  socket.on('project-state', (data: ProjectStateData) => {
    try {
      if (!data.projectId) {
        socket.emit('error', { message: 'Project ID is required' });
        return;
      }

      socket.to(data.projectId).emit('project-state', data);
      logger.debug(`Project state updated for project ${data.projectId}`);
    } catch (error) {
      logger.error('Error in project-state:', error);
      socket.emit('error', { message: 'Failed to update project state' });
    }
  });

  socket.on('new-file', (projectId: string) => {
    try {
      if (!projectId) {
        socket.emit('error', { message: 'Project ID is required' });
        return;
      }

      socket.broadcast.to(projectId).emit('new-file');
      logger.debug(`New file created in project ${projectId}`);
    } catch (error) {
      logger.error('Error in new-file:', error);
      socket.emit('error', { message: 'Failed to create new file' });
    }
  });

  socket.on('code-changed', (data: CodeChangedData) => {
    try {
      if (!data.projectId || !data.fileId) {
        socket.emit('error', { message: 'Project ID and File ID are required' });
        return;
      }

      socket.to(data.projectId).emit('code-changed', data);
      logger.debug(`Code changed in project ${data.projectId}, file ${data.fileId}`);
    } catch (error) {
      logger.error('Error in code-changed:', error);
      socket.emit('error', { message: 'Failed to sync code changes' });
    }
  });

  socket.on('code-saved', (data: CodeChangedData) => {
    try {
      if (!data.projectId || !data.fileId) {
        socket.emit('error', { message: 'Project ID and File ID are required' });
        return;
      }

      socket.to(data.projectId).emit('code-saved', data);
      logger.debug(`Code saved in project ${data.projectId}, file ${data.fileId}`);
    } catch (error) {
      logger.error('Error in code-saved:', error);
      socket.emit('error', { message: 'Failed to sync code save' });
    }
  });

  socket.on('leave-project', async (projectId: string, userId: string) => {
    try {
      if (!projectId || !userId) {
        socket.emit('error', { message: 'Project ID and User ID are required' });
        return;
      }

      try {
        const response = await fetch(`${config.nextApiEndpoint}/projects/removeParticipant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ projectId, userId }),
          signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
          logger.warn(`Failed to remove participant from database: ${response.status}`);
        }
      } catch (fetchError) {
        logger.error('Error removing participant from database:', fetchError);
      }

      socket.leave(projectId);
      socket.to(projectId).emit('user-left', { userId });
      
      logger.info(`User ${userId} left project ${projectId}`);
    } catch (error) {
      logger.error('Error in leave-project:', error);
      socket.emit('error', { message: 'Failed to leave project' });
    }
  });

  socket.on('disconnect', () => {
    const { projectId, userId } = socket.data as Partial<SocketData> ?? {};

    if (projectId && userId) {
      socket.broadcast.to(projectId).emit('user-left', { userId });
      logger.info(`User ${userId} disconnected from project ${projectId}`);
    } else {
      logger.warn(`Socket disconnected without complete data: ${socket.id}`);
    }
  });

  socket.on('error', (error) => {
    logger.error('Socket error:', error);
  });
});

async function createTempDirectory(): Promise<string> {
  const id = uuidv4();
  const tempDir = path.join('codes', id);
  
  await fs.promises.mkdir('codes', { recursive: true });
  await fs.promises.mkdir(tempDir);
  
  return tempDir;
}

async function cleanupTempDirectory(tempDir: string): Promise<void> {
  try {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    logger.error(`Failed to cleanup temp directory ${tempDir}:`, error);
  }
}

function buildExecutionCommand(lang: string, tempDir: string, ext: string, cmd: string): string {
  const sys = os.platform();
  
  if (lang === 'javascript') {
    return `node ${path.join(tempDir, `script.${ext}`)}`;
  }
  
  let filepath = '';
  if (sys === 'win32') {
    filepath = `%cd%/${tempDir}`;
  } else {
    filepath = `$(pwd)/${tempDir}`;
  }
  
  const filename = `script.${ext}`;
  return `docker run --rm -m 128m --cpus=0.5 --network=none -v ${filepath}:/app/code saumyashah40/codev:v2 ${cmd} /app/code/${filename}`;
}

async function executeCode(code: string, lang: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let tempDir = '';
    
    try {
      if (!(lang in languageConfigs)) {
        throw new Error('Language not supported');
      }

      const { ext, cmd } = languageConfigs[lang as keyof typeof languageConfigs];
      
      tempDir = await createTempDirectory();
      const scriptPath = path.join(tempDir, `script.${ext}`);
      await fs.promises.writeFile(scriptPath, code);

      const command = buildExecutionCommand(lang, tempDir, ext, cmd);
      
      logger.debug(`Executing command: ${command}`);

      const childProcess = exec(command, {
        timeout: config.execution.timeout,
        maxBuffer: 1024 * 1024,
      }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            resolve('Error: Execution timed out');
          } else {
            resolve(`Error: ${error.message}`);
          }
          return;
        }
        
        if (stderr) {
          resolve(stderr);
          return;
        }
        
        resolve(stdout || 'Code executed successfully (no output)');
      });

      // Cleanup after execution
      childProcess.on('exit', () => {
        cleanupTempDirectory(tempDir);
      });

    } catch (error) {
      if (tempDir) {
        cleanupTempDirectory(tempDir);
      }
      reject(error);
    }
  });
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.post('/execute', executeLimiter, async (req, res) => {
  try {
    const { error, value } = executeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { code, lang } = value as ExecuteRequest;

    logger.info(`Code execution request - Language: ${lang}, Code length: ${code.length}`);

    const output = await executionLimit(() => executeCode(code, lang));

    res.json({ output });

  } catch (error) {
    logger.error('Code execution error:', error);
    res.status(500).json({ 
      error: 'Internal server error during code execution' 
    });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

server.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});