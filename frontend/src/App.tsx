import React, { useEffect, useState, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // 👈 comentado para demo

const App: React.FC = () => {
  // Estado para guardar los mensajes recibidos
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Estado para guardar el JWT interno que devuelve tu backend (no usado en demo)
  const [token, setToken] = useState<string | null>(null);

  // Inicializar el WebSocket una sola vez
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (hasConnectedRef.current) return;

    socketRef.current = new WebSocket("ws://localhost:3000");
    hasConnectedRef.current = true;

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    socketRef.current.onclose = () => {
      console.log("⚠️ WebSocket cerrado");
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ Error en WebSocket:", err);
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      hasConnectedRef.current = false;
    };
  }, []);

  // Función para enviar mensajes
  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.error("No se pudo enviar el mensaje: WebSocket no está abierto");
    }
  };

  // Manejar login con Google (no usado en demo)
  /*
  const handleLoginSuccess = async (credentialResponse: any) => {
    console.log("Respuesta de Google:", credentialResponse);

    try {
      const res = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (data.token) {
        setToken(data.token); // guardamos el JWT interno
        console.log("Usuario autenticado:", data.user);
        console.log("Token interno:", data.token);
      } else {
        console.error("El backend no devolvió un token válido");
      }
    } catch (err) {
      console.error("Error en login:", err);
    }
  };
  */

  // Renderizar la interfaz
  return (
    <div>
      <h1>Chat en tiempo real</h1>

      {/* Mostrar chat siempre en demo */}
      <MessageList messages={messages} />
      <MessageForm onSend={sendMessage} />

      {/* Login con Google (comentado en demo) */}
      {/*
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
        {!token && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Error en login con Google")}
          />
        )}
      </GoogleOAuthProvider>
      */}
    </div>
  );
};

export default App;
