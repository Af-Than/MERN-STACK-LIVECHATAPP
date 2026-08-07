import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Chats from "./pages/chats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;