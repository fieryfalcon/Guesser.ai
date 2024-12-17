import React, { useState, useEffect } from "react";
import { waitroomSocket } from "../Services/socket";
import { chatroomSocket } from "../Services/socket";

const JoinWaitRoom = ({
  setRoomId,
  setIsInRoom,
  setQuestions,
  username,
  setUsername,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    console.log("Use effect for join wait room");

    waitroomSocket.on("grouped", (data) => {
      console.log("Received grouped event");
      const { roomId, questions } = data;
      setRoomId(roomId);
      setQuestions(questions);
      joinChatRoom(roomId, username);
    });

    return () => {
      waitroomSocket.off("connect");
      waitroomSocket.off("grouped");
    };
  }, [username]);

  const enterWaitlist = () => {
    waitroomSocket.emit("join");
    setIsWaiting(true);
  };
  function joinChatRoom(roomId, Username) {
    console.log("Joining chat room with id", roomId);
    console.log("Username", Username);
    chatroomSocket.emit("joinRoom", { roomId, username });

    setIsInRoom(true);
  }

  return (
    <div>
      {isWaiting ? (
        <div>
          <div>Waiting for other users to join...</div>
        </div>
      ) : (
        <div>
          <h1>Enter Username</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={enterWaitlist}>Join Room</button>
          <h1>Username: {username}</h1>
        </div>
      )}
    </div>
  );
};

export default JoinWaitRoom;
