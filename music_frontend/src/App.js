import './App.css';
import { HomePage, RoomJoinPage, CreateRoomPage } from "./pages";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<p>This is a home page</p>} />
                <Route path="/join" element={<RoomJoinPage/>}/>
                <Route path="/create" element={<CreateRoomPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
