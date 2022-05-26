import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRoomPage = () => {
    const defaultVotes = 2;

    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState('true');

    // 이동할 페이지로 값을 넘길때 사용
    const navigate = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value)
    }

    const handleRoomButtonPressed = async () => {
        try {
            const response = await axios.post('/api/create-room', {
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }, { withCredentials: true});
            navigate("/room/" + response.data.code, {
                state: response.data
            });
        } catch (e) {
            console.error(e);
        }
    }



    return (
        <Grid container spacing={1} defaultValue={false} style={{display: "block"}}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText style={{textAlign: "center"}}>
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelplacement="bottom"
                            value="true"
                        />
                        <FormControlLabel
                            control={<Radio color="secondary" />}
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
                        defaultValue={defaultVotes}
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
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                    Create A Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={ Link }>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}

export default CreateRoomPage;