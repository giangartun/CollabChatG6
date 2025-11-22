import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();


app.use(express.json());

// Endpoint de prueba
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

// Crear usuario
app.post("/users", async (req, res) => {
  try {
    const { name, email, provider, providerId } = req.body;
    const user = await prisma.user.create({
      data: { name, email, provider, providerId },
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Error creando usuario" });
  }
});

// Listar usuarios
app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Crear grupo
app.post("/groups", async (req, res) => {
  try {
    const { name } = req.body;
    const group = await prisma.group.create({
      data: { name },
    });
    res.json(group);
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Error creando grupo" });
  }
});

// Listar grupos
app.get("/groups", async (_req, res) => {
  const groups = await prisma.group.findMany();
  res.json(groups);
});

// Crear mensaje
app.post("/messages", async (req, res) => {
  try {
    const { content, senderId, receiverId, groupId } = req.body;
    const message = await prisma.message.create({
      data: { content, senderId, receiverId, groupId },
    });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Error creando mensaje" });
  }
});

// Listar mensajes
app.get("/messages", async (_req, res) => {
  const messages = await prisma.message.findMany();
  res.json(messages);
});

// WebSocket
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
