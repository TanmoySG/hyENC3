import React, { useState } from 'react';
import { Grid, Button, TextField, Paper } from "@material-ui/core";
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Skeleton from '@material-ui/lab/Skeleton';
import LinearProgress from '@material-ui/core/LinearProgress';




function Decryption() {



    let theme = createMuiTheme({
        palette: {
            type: "dark"
        },
        typography: {
            fontFamily: "Work Sans",
        },
    });

    theme = responsiveFontSizes(theme);

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    const [progress, setProgress] = React.useState(10);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container direction="row" alignItems="center" style={{ marginTop: "15px" }}  >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Paper elevation={3} style={{ padding: "20px" }}>
                        <Typography variant="h4" style={{ float: "left", fontWeight: "medium" }}>Decryption</Typography>
                        <Grid container direction="row" alignItems="flex-start" style={{ marginTop: "10px" }}>
                            <Grid item xs={6} sm={5} md={5} lg={6} xl={6} style={{ paddingRight: "10px" }}>
                                <Typography variant="subtitle2">
                                    PASSWORD
                                    </Typography>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <TextField id="outlined-basic" label="Enter Password" variant="outlined" style={{ width: "100%", marginTop: "5px" }} />
                                    </Grid>
                                </Grid>
                                <Button variant="contained" size="large" style={{ color: "black", backgroundColor: "#d0d1ff", marginTop: "10px" }} elevation={5}>Start File Decryption</Button>
                            </Grid>
                            <Grid item xs={6} sm={7} md={7} lg={6} xl={6} style={{ paddingLeft: "10px" }}>
                                <Typography variant="subtitle2">
                                    STEGO IMAGE
                                    </Typography>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Accordion style={{ backgroundColor: "#0c0d0e", marginTop: "5px" }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                                                SELECTED STEGO IMAGE :  Image.jpg
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Skeleton variant="rect" sx={{ bgcolor: "#ffd6a5" }} />
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                                <Button variant="contained" style={{ color: "black", backgroundColor: "#ffd6a5", marginTop: "10px" }} elevation={5}>Pick cover image</Button>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" alignItems="flex-end" style={{ marginTop: "20px" }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                <LinearProgress variant="determinate" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider >
    );
}

export default Decryption;
