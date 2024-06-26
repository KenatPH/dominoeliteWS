import { log } from 'console';
import { Server, Socket } from 'socket.io';
const moment = require('moment');

let timers: { [key: string]: NodeJS.Timeout } = {};

export const handleSocketConnection = (io: Server, socket: Socket) => {
    
    socket.on('joinGame', (data) => {
        console.log('Un usuario se ha conectado');

        console.log(data);
        let gameId 
        if (data && data.gameId && data.action === "player"){
            gameId = data.gameId
            socket.join(gameId);
            console.log('Un usuario se ha conectado a la sala: '+gameId);
            // io.to(gameId).emit('joinedGame', `Te haz unido a la partida`);
        }
        
        if (data && data.action === "initGame" ){
            gameId = data.gameId
            console.log("comienza el juego");
            
            if (!timers[gameId]) {

                let endTime = moment().add(data.time, 'seconds')
                io.to(gameId).emit('initGame', `La Partida a comenzado`);

                timers[gameId] = setInterval(() => {
                    
                    let now = moment();
                    let duration = moment.duration(endTime.diff(now));
                    let hours = Math.floor(duration.asHours());
                    let mins = Math.floor(duration.asMinutes()) - hours * 60;
                    let secs = Math.floor(duration.asSeconds()) - mins * 60 - hours * 3600;
                    
                    if (hours < 0 || mins < 0 || secs < 0) {
                        console.log('¡Tiempo agotado! partida: ' + gameId);
                        clearInterval(timers[gameId]);
                        delete timers[gameId];
                        io.to(gameId).emit('endGame', `¡Partida Finalizada!`);
                    } else {
                        io.to(gameId).emit('timer', `${mins}:${secs}`);
                    }

                }, 1000)//fin del intervalo
                
            }

        }


        if (data && data.action === "endGame"){
            io.to(gameId).emit('endGame', `¡Partida Finalizada!`);
        }

    });

    socket.on('leaveGame', (gameId) => {


        socket.leave(gameId);

        // Si no hay más jugadores en la partida, detén el cronómetro
        if (io.sockets.adapter.rooms.get(gameId).size === 0) {
            clearInterval(timers[gameId]);
            delete timers[gameId];
        }
    });

    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });
};
