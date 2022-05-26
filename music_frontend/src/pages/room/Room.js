import React, {useState, useEffect} from "react";
import {useParams, useLocation} from "react-router-dom";
import axios from"axios";

const Room = () => {
    // Navigate state
    const location = useLocation();

    const [votesToSkip, setVotesToSkip] = useState(location.state.votes_to_skip);
    const [guestCanPause, SetGuestCanPause] = useState(location.state.guest_can_pause);
    const [isHost, setIsHost] = useState(location.state.is_host);
    const {roomCode} = useParams();


    // const getRoomDetails = async () => {
    //     try {
    //         const response = await axios.get('/api/get-room?code=' + roomCode);
    //         const data = response.data;
    //         console.log(data)
    //     } catch(e) {
    //         console.error(e)
    //     }
    // }
    //
    // useEffect(() => {
    //     getRoomDetails();
    // }, []);

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    );
}

export default Room;