import React, { useState } from "react";

interface Props {
  onSend: (msg: string) => void;
}

const MessageForm: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="flex-grow px-3 py-2 rounded-lg border border-neutral-400 
                   bg-gray-200 text-black placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <button
        type="submit"
        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageForm;
