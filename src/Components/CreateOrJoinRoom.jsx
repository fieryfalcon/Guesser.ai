import React, { useState, useEffect } from "react";
import { waitroomSocket, chatroomSocket } from "../Services/socket";

const CreateRoomOrJoinComponent = () => {
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [username, setUsername] = useState("");
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    waitroomSocket.on("connect", () => {
      console.log("Connected to waitroom");

      waitroomSocket.on("grouped", (data) => {
        const { roomId, questions } = data;
        setRoomId(roomId);
        setQuestions(questions);
        joinChatRoom(roomId);
      });
      chatroomSocket.on("chatMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      chatroomSocket.on("newRound", (data) => {
        const { round } = data;
        setRound(round);
        startTimer();
      });
      chatroomSocket.on("endGame", (data) => {
        setTimer(null);
        setGameOver(true);
        setRound(1);
      });

      console.log("Messages", messages);
    });

    return () => {
      waitroomSocket.off("connect");
      waitroomSocket.off("grouped");
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (timer) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const startTimer = () => {
    const timerInstance = setTimeout(() => {
      endRound();
    }, 10000);
    setTimer(timerInstance);
  };

  const endRound = () => {
    clearTimeout(timer);
    setRemainingTime(10);
  };

  const enterWaitlist = () => {
    waitroomSocket.emit("join");
    setIsWaiting(true);
  };

  const joinChatRoom = (roomId) => {
    console.log("Joining chat room with id", roomId);
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
      ) : gameOver ? (
        <div>
          <h1>Game Over</h1>
          <div>Thanks for playing!</div>
        </div>
      ) : (
        <div>
          <div>
            <h1>Chat Room</h1>
            <div>
              <div>
                <h2>Round {round}</h2>
                <div>{questions[round - 1]}</div>
                <div>Time remaining: {remainingTime} seconds</div>
              </div>
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
