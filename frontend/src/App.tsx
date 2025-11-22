import React, { useEffect, useState, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App: React.FC = () => {
  // Estado para guardar los mensajes recibidos
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Inicializar el WebSocket una sola vez
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // Cerrar el socket cuando el componente se desmonte
    return () => {
      socketRef.current?.close();
    };
  }, []);

  // Función para enviar mensajes
  const sendMessage = (msg: string) => {
    socketRef.current?.send(msg);
  };

  // Renderizar la interfaz
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <div>
        <h1>Chat en tiempo real</h1>
        <MessageList messages={messages} />
        <MessageForm onSend={sendMessage} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
