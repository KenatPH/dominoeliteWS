import express from 'express';
import { Server } from 'socket.io';
import { handleSocketConnection } from './socket';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

io.on('connection', (socket) => handleSocketConnection(io, socket));
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export default app