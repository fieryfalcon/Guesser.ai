import React, { useState } from "react";
import JoinWaitRoom from "../Components/JoinWaitroom";
import ChatRoom from "../Components/ChatRoom";

const CreateRoomOrJoinComponent = () => {
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  return (
    <div>
      {!isInRoom ? (
        <JoinWaitRoom
          setRoomId={setRoomId}
          setIsInRoom={setIsInRoom}
          setQuestions={setQuestions}
          username={username}
          setUsername={setUsername}
        />
      ) : gameOver ? (
        <div>
          <h1>Game Over</h1>
          <div>Thanks for playing!</div>
        </div>
      ) : (
        <ChatRoom
          roomId={roomId}
          username={username}
          questions={questions}
          setGameOver={setGameOver}
          setIsInRoom={setIsInRoom}
        />
      )}
    </div>
  );
};

export default CreateRoomOrJoinComponent;
