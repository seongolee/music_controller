import './App.css';
import { HomePage, RoomJoinPage, CreateRoomPage, Room } from "./pages";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/join" element={<RoomJoinPage/>} />
                <Route path="/create" element={<CreateRoomPage/>} />
                <Route path="/room/:roomCode" element={<Room/>} />
                <Route path="*" element={<p>This is not found</p>} />
            </Routes>
        </Router>
    );
}

export default App;
