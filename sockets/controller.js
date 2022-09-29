import { Socket } from 'socket.io';
import { comprobarJWT } from '../helpers/generarJWT.js';
import ChatMensajes from '../models/chat-mensajes.js';

const chatMensajes = new ChatMensajes();

export const socketController = async (socket = new Socket(), io) => {
  const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

  if (!usuario) {
    return socket.disconnect();
  }

  // Agregar al usuario conectado
  chatMensajes.conectarUsuario(usuario);

  io.emit('usuarios-activos', chatMensajes.usuariosArr); //Servidor
  socket.emit('recibir-mensajes', chatMensajes.ultimos10);

  // Conectarlo a una sala especial (mensaje privados)
  socket.join(usuario.id); // global, socket.id, usuario.id

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
  });

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("mensaje-privado" ,{de: usuario.nombre, mensaje})
    } else {
      // MENSAJE GENERAL
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje); // Cliente envia mensaje
      io.emit('recibir-mensajes', chatMensajes.ultimos10); // Servidor emite para comprobar mensajes nuevos
    }
  });
};
