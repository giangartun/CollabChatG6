import React, { useEffect, useState } from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";

const App: React.FC = () => {
  // Estado para guardar los mensajes recibidos
  const [messages, setMessages] = useState<string[]>([]);

  // Conexión al WebSocket del backend
  const socket = new WebSocket("ws://localhost:3000");

  // Configurar recepción de mensajes
  useEffect(() => {
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
  }, []);

  // Función para enviar mensajes
  const sendMessage = (msg: string) => {
    socket.send(msg);
  };

  // Renderizar la interfaz
  return (
    <div>
      <h1>Chat en tiempo real</h1>
      <MessageList messages={messages} />
      <MessageForm onSend={sendMessage} />
    </div>
  );
};

export default App;
