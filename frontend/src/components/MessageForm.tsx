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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default MessageForm;