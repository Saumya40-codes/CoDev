import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
));

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join-project', (projectId) => {
        socket.join(projectId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.disconnect();
    });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});