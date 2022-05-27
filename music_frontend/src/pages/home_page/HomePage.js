import React, {useEffect} from "react";
import {Grid, Button, ButtonGroup, Typography} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    const navigate = useNavigate();

    const roomInformation = async () => {
        try{
            const response = await axios.get('/api/user-in-room', {
                withCredentials: true
            });
            if(response.data.code){
                navigate('/room/' + response.data.code);
            }
        } catch(e){
            console.log(e.response.data)
        }
    }

    useEffect(() => {
        roomInformation();
        }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                    House party
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={Link}>
                        Join a Room
                    </Button>
                    <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}

export default HomePage;