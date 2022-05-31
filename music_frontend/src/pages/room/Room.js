import React, {useState, useEffect} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {Grid, Button, Typography} from "@material-ui/core";
import {CreateRoomPage} from "../index";

const Room = () => {
    // Navigate state
    const location = useLocation();
    const navigate = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const {roomCode} = useParams();

    const getRoomDetails = async () => {
        try {
            const response = await axios.get('/api/get-room?code=' + roomCode);
            const data = response.data;
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(Boolean(data.guest_can_pause));
            setIsHost(Boolean(data.is_host));
        } catch (e) {
            console.error(e);
            navigate('/');
        }
    }

    const leaveButtonPressed = async () => {
        try {
            const response = await axios.post('/api/leave-room', {}, {
                withCredentials: true
            });
            navigate('/');
        } catch (e) {
            console.log(e.response.data);
        }
    }

    const updateShowSettings = (value) => {
        setShowSettings(value)
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    useEffect(() => {
        getRoomDetails();
    }, []);

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                    >
                    </CreateRoomPage>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={() => updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    if (showSettings) {
        return renderSettings();
    } else {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {isHost.toString()}
                    </Typography>
                </Grid>
                {isHost ? renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default Room;