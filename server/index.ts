import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://co-dev-sigma.vercel.app/', 'https://vercel.com/saumya40codes-projects/co-dev/CkS4NmjgZS6WMtQBUztCexE8UihE', 'https://co-dev-saumya40codes-projects.vercel.app/', 'https://co-dev-git-master-saumya40codes-projects.vercel.app/'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    }
});

server.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});

io.on('connection', (socket) => {

    console.log('User connected');

    socket.on('join-project', (projectId:string, userId: string) => {
        socket.join(projectId);
        socket.handshake.query = { projectId, userId};
        io.in(projectId).emit('user-joined');
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