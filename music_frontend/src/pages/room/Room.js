import React, {useState, useEffect} from "react";
import {useParams, useLocation} from "react-router-dom";
import axios from"axios";

const Room = () => {
    // Navigate state
    const location = useLocation();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, SetGuestCanPause] = useState('');
    const [isHost, setIsHost] = useState(false);
    const {roomCode} = useParams();

    const getRoomDetails = async () => {
        try {
            const response = await axios.get('/api/get-room?code=' + roomCode);
            const data = response.data;
            setVotesToSkip(data.votes_to_skip);
            SetGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
        } catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getRoomDetails();
    }, []);

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