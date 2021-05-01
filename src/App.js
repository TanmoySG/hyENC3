import React from 'react';
import './App.css';
import { Container } from "@material-ui/core";
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Landing from "./components/landing.component.js"

function App() {

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
      <Container style={{ padding: "10px" }}>
        <Landing />
      </Container>
    </ThemeProvider>
  );
}

export default App;
