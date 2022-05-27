import React, {useState, useLayoutEffect} from "react";
import {useParams, useLocation, Link} from "react-router-dom";
import axios from"axios";
import {Grid, Button, Typography} from "@material-ui/core";

const Room = () => {
    // Navigate state
    const location = useLocation();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const {roomCode} = useParams();


    const getRoomDetails = async () => {
        try {
            const response = await axios.get('/api/get-room?code=' + roomCode);
            const data = response.data;
            console.log(data);
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
        } catch(e) {
            console.error(e)
        }
    }

    useLayoutEffect(() => {
        getRoomDetails();
    }, []);

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
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>

    );
}

export default Room;