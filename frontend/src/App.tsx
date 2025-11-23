import React, { useEffect, useState, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";

const DUMMY_CONTACTS = [
  { name: "Otacon", status: "Online" },
  { name: "Meryl Silverburgh", status: "Away" },
  { name: "Revolver Ocelot", status: "Offline" },
  { name: "Gray Fox", status: "Busy" },
  { name: "Big Boss", status: "Online" },
  { name: "The Boss", status: "Online" },
];

const ContactItem = ({ name, status }: { name: string; status: string }) => (
  <div className="flex items-center p-3 my-2 rounded-xl bg-neutral-600 border border-neutral-700 hover:bg-neutral-700 transition-colors cursor-pointer">
    <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 mr-3 border-2 border-green-500"></div>
    <div className="flex-grow">
      <div className="h-2 bg-gray-300 rounded mb-1 w-3/4"></div>
      <div className="h-2 bg-gray-400 rounded w-1/2"></div>
    </div>
    <div className="w-4 h-4 rounded-full bg-white flex-shrink-0 ml-3"></div>
  </div>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
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

  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.error("No se pudo enviar el mensaje: WebSocket no está abierto");
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-black to-[#4A4A4A] p-4 text-white">
      {/* Barra lateral de contactos */}
      <div className="w-1/4 min-w-[280px] mr-4 p-4 rounded-xl bg-neutral-700 flex flex-col border border-neutral-600">
        <div className="bg-gray-400 p-4 rounded-xl mb-4 text-black border-4 border-gray-600">
          <div className="flex justify-between items-center font-extrabold text-lg">
            <span>USUARIO</span>
            <div className="w-5 h-5 rounded-full bg-white"></div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-3 uppercase text-white">CONTACTOS</h2>

        <div className="flex-grow overflow-y-auto pr-2">
          {DUMMY_CONTACTS.map((contact, index) => (
            <ContactItem key={index} name={contact.name} status={contact.status} />
          ))}
        </div>
      </div>

      {/* Área de chat principal */}
      <div className="flex-grow flex flex-col bg-neutral-800 rounded-xl border border-neutral-600">
        <div className="p-4 border-b border-neutral-600 bg-neutral-700 rounded-t-xl flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </div>

        {/* Mensajes */}
        <div className="flex-grow bg-black p-4 overflow-y-auto">
          <MessageList messages={messages} />
        </div>

        {/* Formulario de envío */}
        <div className="p-3 border-t border-neutral-600 bg-neutral-700 rounded-b-xl">
          <MessageForm onSend={sendMessage} />
        </div>
      </div>
    </main>
  );
};

export default App;
