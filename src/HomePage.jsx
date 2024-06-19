// HomePage.jsx
import React, { useState } from "react";

const HomePage = ({ joinRoom }) => {
  const [room, setRoom] = useState("");

  const handleJoinRoom = () => {
    joinRoom(room);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Join a Room</h1>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default HomePage;
