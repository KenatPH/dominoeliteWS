import express from 'express';
import { Server } from 'socket.io';
import { handleSocketConnection } from './socket';

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

io.on('connection', (socket) => handleSocketConnection(io, socket));

server.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});

export default app