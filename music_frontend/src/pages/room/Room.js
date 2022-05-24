import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from"axios";

const Room = () => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, SetGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const {roomCode} = useParams();

    const getRoomDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get-room', {
                params: {
                    'code': roomCode
                }
            });
            const data = response.data;
            console.log(data)

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
            <p>Guest Can Pause: {guestCanPause}</p>
            <p>Host: {isHost}</p>
        </div>
    );
}

export default Room;