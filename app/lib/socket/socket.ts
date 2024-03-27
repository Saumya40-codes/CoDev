import { io } from "socket.io-client";

const loc = process.env.HOST_ENV === "dev" ? "http://localhost:3000" : "https://codev-sg8a.onrender.com";

const socket = io(loc);

export default socket;