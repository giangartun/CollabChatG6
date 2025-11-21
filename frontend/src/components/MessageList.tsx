import React from "react";

interface Props {
  messages: string[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <ul>
      {messages.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))}
    </ul>
  );
};

export default MessageList;