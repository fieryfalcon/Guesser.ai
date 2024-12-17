import React, { useState, useEffect } from "react";
import { chatroomSocket } from "../Services/socket";

const ChatRoom = ({
  roomId,
  username,
  questions,
  setGameOver,
  setIsInRoom,
}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30);
  const [playerKicked, setPlayerKicked] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votingOptions, setVotingOptions] = useState([]);
  const [votedFor, setVotedFor] = useState(null);

  useEffect(() => {
    console.log("Use effect for chat room");
    chatroomSocket.on("chatMessage", (data) => {
      console.log("Received chat message", data);
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
    chatroomSocket.on("votingRequest", (data) => {
      startVoting(data);
    });

    return () => {
      chatroomSocket.off("chatMessage");
      chatroomSocket.off("newRound");
      chatroomSocket.off("endGame");
    };
  }, [setGameOver]);

  function startVoting(data) {
    console.log("Received voting request", data);
    const { users } = data;
    setVotingOptions(users);
    setVoting(true);
    setTimeout(() => {
      setVoting(false);
    }, 15000);
  }

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
    }, 30000);
    setTimer(timerInstance);
  };

  const endRound = () => {
    clearTimeout(timer);
    setTimer(null);
    setRemainingTime(30);
  };

  const sendMessage = () => {
    console.log("Sending message");
    chatroomSocket.emit("chatMessage", { roomId, message, username });
    setMessage("");
  };
  const Vote = (user) => {
    console.log("Voted for", user);
    chatroomSocket.emit("voted", { roomId, username, votedFor: user });
    setVotedFor(user);
  };

  return (
    <div>
      <h1>Chat Room</h1>
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
      {playerKicked ? (
        <div>
          <h3>You have been kicked from the room.</h3>
        </div>
      ) : (
        <div>
          {voting ? (
            <div>
              {votedFor == null ? (
                <div>
                  <h3>Vote to Kick</h3>

                  {votingOptions.map((option, index) => (
                    <div key={index}>
                      <button onClick={() => Vote(option.socketId)}>
                        {option.username}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <h2>You voted for {votedFor}</h2>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
