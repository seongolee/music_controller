import React, {useState, useRef} from "react";
import {TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RoomJoinPage = () => {
    const navigate = useNavigate();

    const [inputRoomCode, setInputRoomCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const roomCode = useRef('')

    const handleTextFieldChange = (e) => {
        setInputRoomCode(e.target.value);
    }

    const roomButtonPressed = async () => {
        try{
            const response = await axios.post('/api/join-room', {
                'code': inputRoomCode
            }, {
                withCredentials: true
            });
            navigate("/room/" + inputRoomCode);
        } catch(e) {
            console.error(e)
            setErrorMessage(e.response.data["Bad Request"]);
            setIsError(true);
            roomCode.current.focus();
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={isError}
                    inputRef={roomCode}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={inputRoomCode}
                    helperText={errorMessage}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={roomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}

export default RoomJoinPage;