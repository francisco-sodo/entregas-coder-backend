import ChatService from "../services/dao/db/chat.service.js";

export default function chatController(ioServer) {
    const chatService = new ChatService();
  

        ioServer.on('connection', async socket => {
            // El usuario que se conecte puede ver todos los mensajes existentes
            socket.emit('messageLogs', await chatService.getAll());
        
            // guardar mensajes en la db y mostrarlos a todos los usuarios
            socket.on('message', async data => {
                await chatService.save(data);
                ioServer.emit('messageLogs', await chatService.getAll());
            });
        
            // Hacer broadcast del nuevo usuario que se conecta al chat
            socket.on('userConnected', data => {
                // console.log(data);
                socket.broadcast.emit('userConnected', data.user);
            });
        
            // Cerrar la conexión con un usuario en particular
            socket.on('closeChat', data => {
                if (data.close === "close") socket.disconnect();
                socket.broadcast.emit('closeMsg', data.user);
            });
        
        
        });

  



    }
