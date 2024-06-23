import React, { useState, useEffect } from "react";
import { waitroomSocket, chatroomSocket } from "../Services/socket";

const CreateRoomOrJoinComponent = () => {
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    waitroomSocket.on("connect", () => {
      console.log("Connected to waitroom");

      waitroomSocket.on("grouped", (roomId) => {
        console.log(`Grouped into room: ${roomId}`);
        setRoomId(roomId);
        // setIsInRoom(true);
        joinChatRoom(roomId);
      });
      chatroomSocket.on("chatMessage", (data) => {
        console.log("Received chat message", data);
        // const { message, username } = data;
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      console.log("Messages", messages);
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

  // const joinRoom = (roomId) => {
  //   joinChatRoom(roomId);
  // };

  const joinChatRoom = (roomId) => {
    console.log("Joining chat room");
    chatroomSocket.emit("joinRoom", roomId);

    setIsInRoom(true);
  };

  const sendMessage = () => {
    console.log("Sending message");
    chatroomSocket.emit("chatMessage", { roomId, message, username });
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
              <h1>Enter Username</h1>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <button onClick={enterWaitlist}>Join Room</button>
            </div>
          </div>
        )
      ) : (
        <div>
          <div>
            <h1>Chat Room</h1>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <span>{msg.username}:</span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
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
