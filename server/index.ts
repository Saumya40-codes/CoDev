import express from 'express';
import http from 'http';
import cors from 'cors';

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


http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
