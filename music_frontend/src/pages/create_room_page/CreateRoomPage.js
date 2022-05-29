import React, {useState, useRef} from "react";
import {Button, Grid, Typography, TextField, FormHelperText} from "@material-ui/core";
import {FormControl, Radio, RadioGroup, FormControlLabel, Collapse} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const CreateRoomPage = (props) => {
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip | 2);
    const [guestCanPause, setGuestCanPause] = useState(typeof props.guestCanPause === "undefined" ? "true" : props.guestCanPause.toString());
    const [message, setMessage] = useState("");

    const title = props.update ? "Update Room" : "Create a Room";

    // 이동할 페이지로 값을 넘길때 사용
    const navigate = useNavigate();
    
    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value);
    }

    const handleRoomButtonPressed = async () => {
        try {
            const response = await axios.post('/api/create-room', {
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }, {withCredentials: true});
            navigate("/room/" + response.data.code);
        } catch (e) {
            console.error(e);
        }
    }

    const handleUpdateButtonPressed = async () => {
        try {
            const response = await axios.patch('/api/update-room', {
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode
            }, {withCredentials: true});
            setMessage(response.data.msg);
        } catch (e) {
            setMessage(e.response.data.msg);
        }
    }

    const renderCreateButtons = () => {
        return (
            <>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </>
        );
    }

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );
    }


    return (
        <Grid container spacing={1} style={{display: "block"}}>
            <Grid item xs={12} align="center">
                <Collapse in={message !== ""}>
                    {message}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText style={{textAlign: "center"}}>
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup row value={guestCanPause} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel
                            control={<Radio color="primary"/>}
                            label="Play/Pause"
                            labelplacement="bottom"
                            value="true"
                        />
                        <FormControlLabel
                            control={<Radio color="secondary"/>}
                            label="No Control"
                            labelplacement="bottom"
                            value="false"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign: "center"}
                        }}
                    />
                    <FormHelperText style={{textAlign: "center"}}>
                        Votes Required To Skip Song
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

export default CreateRoomPage;