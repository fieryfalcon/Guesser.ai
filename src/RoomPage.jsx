// RoomPage.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Update this URL to your backend server

const RoomPage = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("question", (question) => {
      setQuestion(question);
    });

    return () => {
      socket.off("message");
      socket.off("question");
    };
  }, [roomId]);

  const handleSendMessage = () => {
    socket.emit("sendMessage", { roomId, message });
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Room: {roomId}</h1>
      <h2>Question: {question}</h2>
      <div
        style={{
          border: "1px solid #000",
          padding: "10px",
          marginBottom: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default RoomPage;
