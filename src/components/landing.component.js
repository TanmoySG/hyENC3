import React, {useState} from 'react';
import { Container, Grid, Button } from "@material-ui/core";
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from '@material-ui/core/Typography';
import Encryption from "./encryption.component.js";
import Decryption from "./decryption.component.js";



function Landing() {

    const [service, setService] = useState('encryption')

    let theme = createMuiTheme({
        palette: {
            type: "dark"
        },
        typography: {
            fontFamily: "Work Sans",
        },
    });

    theme = responsiveFontSizes(theme);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="false">
                <Grid container direction="row" alignItems="center"  >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h3" style={{ float: "left", fontWeight: "medium" }}>hy</Typography><Typography variant="h3" style={{ float: "left", fontWeight: "bold", color: "#ffd1ce" }}>ENC3.</Typography>
                    </Grid>
                    <Typography variant="subtitle2" style={{ float: "left", fontWeight: "thin" }}>Encrypt all your files with hyENC.</Typography>
                    <Grid container direction="row" alignItems="center" spacing={2} style={{ paddingTop: "5px", paddingBottom: "5px" }} >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Button variant="contained" onClick={() => setService('encryption')} style={{ backgroundColor: "#d0d1ff", marginRight: "10px" }}>Encrypt</Button>
                            <Button variant="contained" onClick={() => setService('decryption')} style={{ backgroundColor: "#ffe5d9", marginRight: "5px" }}>Decrypt</Button>
                            <Button style={{ color: "#fff3b0" }}>How does it work?</Button>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    service === 'decryption' ? <Decryption /> : <Encryption />
                }
            </Container>
        </ThemeProvider >
    );
}

export default Landing;
