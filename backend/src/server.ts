import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message.toString());

    // Reenviar el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP en http://localhost:${PORT}`);
  console.log(`WebSocket listo en ws://localhost:${PORT}`);
});
