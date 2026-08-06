import './App.css';
import { Routes, Route } from "react-router-dom";
import Chats from "./pages/chats";
import HomePage from "./pages/homepage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact/>
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;