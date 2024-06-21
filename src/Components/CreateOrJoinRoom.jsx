import React, { useState, useEffect } from "react";
import { waitroomSocket, chatroomSocket } from "../Services/socket";

const CreateRoomOrJoinComponent = () => {
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    waitroomSocket.on("connect", () => {
      console.log("Connected to waitroom");

      waitroomSocket.on("grouped", (roomId) => {
        console.log(`Grouped into room: ${roomId}`);
        setRoomId(roomId);
        setIsInRoom(true);
        // joinChatRoom(roomId);
      });
      chatroomSocket.on("chatMessage", (msg) => {
        console.log("Received chat message", msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    });

    return () => {
      waitroomSocket.off("connect");
      waitroomSocket.off("grouped");
    };
  }, []);

  const enterWaitlist = () => {
    waitroomSocket.emit("join");
    setIsWaiting(true);
  };

  //   const joinRoom = (roomId) => {
  //     joinChatRoom(roomId);
  //   };

  // const joinChatRoom = (roomId) => {
  //   chatroomSocket.emit("joinRoom", roomId);
  //   chatroomSocket.on("chatMessage", (msg) => {
  //     setMessages((prevMessages) => [...prevMessages, msg]);
  //   });
  //   setIsInRoom(true);
  // };

  const sendMessage = () => {
    console.log("Sending message");
    chatroomSocket.emit("chatMessage", { roomId, message });
    setMessage("");
  };

  return (
    <div>
      {!isInRoom ? (
        isWaiting ? (
          <div>
            <div>Waiting for other users to join...</div>
          </div>
        ) : (
          <div>
            <div>
              <button onClick={enterWaitlist}>Join Room</button>
            </div>
          </div>
        )
      ) : (
        <div>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.user}: {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default CreateRoomOrJoinComponent;
