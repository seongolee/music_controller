import './App.css';
import {HomePage, RoomJoinPage, CreateRoomPage} from "./pages"

function App(props) {
    return (
        <div>
            <HomePage/>
            <RoomJoinPage/>
            <CreateRoomPage/>
        </div>
    );
}

export default App;
