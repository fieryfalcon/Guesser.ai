// App.jsx
import React, { useState } from "react";
import HomePage from "./HomePage";
import RoomPage from "./RoomPage";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState(null);

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
  };

  return (
    <div>
      {currentRoom ? (
        <RoomPage roomId={currentRoom} />
      ) : (
        <HomePage joinRoom={joinRoom} />
      )}
    </div>
  );
};

export default App;
