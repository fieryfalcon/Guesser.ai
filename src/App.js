// App.jsx
import React, { useState } from "react";
import HomePage from "./HomePage";
import RoomPage from "./RoomPage";
import CreateRoomOrJoinComponent from "./Components/CreateOrJoinRoom";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState(null);

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
  };

  return (
    <div>
      <CreateRoomOrJoinComponent />
    </div>
  );
};

export default App;
