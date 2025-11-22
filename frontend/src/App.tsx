import React, { useEffect, useState, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const App: React.FC = () => {
  // Estado para guardar los mensajes recibidos
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Estado para guardar el JWT interno que devuelve tu backend
  const [token, setToken] = useState<string | null>(null);

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

  // Manejar login con Google
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      setToken(data.token); // guardamos el JWT interno
      console.log("Usuario autenticado:", data.user);
      console.log("Token interno:", data.token);
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  // Renderizar la interfaz
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <div>
        <h1>Chat en tiempo real</h1>

        {/* Botón de login con Google */}
        {!token && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Error en login con Google")}
          />
        )}

        {/* Mostrar chat solo si ya hay token */}
        {token && (
          <>
            <MessageList messages={messages} />
            <MessageForm onSend={sendMessage} />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
