import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { langs } from './controllers/codeConfig';
import { ext } from './controllers/codeConfig';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000','https://co-dev-sigma.vercel.app'],
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://co-dev-sigma.vercel.app', 'https://vercel.com/saumya40codes-projects/co-dev/CkS4NmjgZS6WMtQBUztCexE8UihE', 'https://co-dev-saumya40codes-projects.vercel.app/', 'https://co-dev-git-master-saumya40codes-projects.vercel.app/'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    }
});


io.on('connection', (socket) => {

    console.log('User connected');

    socket.on('join-project', (projectId:string, userId: string) => {
        socket.join(projectId);
        socket.handshake.query = { projectId, userId};
        io.in(projectId).emit('user-joined');
    })

    socket.on('project-state', (data) => {
        io.in(data.projectId).emit('project-state', data);
    });

    socket.on('new-file', (projectId: string) => {
        socket.broadcast.to(projectId).emit('new-file');
    })

    socket.on('code-changed', (data) => {
        io.in(data.projectId).emit('code-changed', data);
    });

    socket.on('disconnect', () => {
        socket.disconnect();
        const { projectId, userId } = socket.handshake.query as { projectId: string, userId: string };
        socket.broadcast.to(projectId).emit('user-left',userId);
    });
});

app.post('/execute', async (req, res) => {
    try{
        const { code, lang } = req.body;

        if(!(lang in langs)){
            return 'Language not supported';
        }

        let id = uuidv4();
        
        fs.mkdirSync(`codes/${id}`);
        fs.writeFileSync(`codes/${id}/script.${ext[lang as keyof typeof ext]}`, code);

        const sys = os.platform();

        let command = '';

        if(lang === 'javascript'){
            command = `node codes/${id}/script.js`; // as node is already installed in the local for application to run
        }
        else if(sys === 'win32'){
            command = `docker run --rm -v %cd%/codes/${id}:/usr/src/app ${langs[lang as keyof typeof langs]}`;
        }
        else{
            command = `docker run --rm -v $(pwd)/codes/${id}:/usr/src/app ${langs[lang as keyof typeof langs]}`;
        }

        exec(command, (error, stdout, stderr) => {

            fs.rm(`codes/${id}`, { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            if (error) {
                return res.status(200).json({ output: error.message });
            }
            if (stderr) {
                return res.status(200).json({ output: stderr });
            }
            
            return res.status(200).json({ output: stdout });
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

server.listen(5000, '0.0.0.0', () => {
    console.log(`Server is running on port 5000`);
});
