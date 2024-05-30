import { io } from "socket.io-client";

const port = process.env.PORT ? process.env.PORT:  "http://localhost:5000";

const socket = io(port);

export default socket;