import React, { useState } from 'react';
import { Grid, Button, TextField, Paper, ButtonGroup } from "@material-ui/core";
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';


//Electron Components
const electron = window.require('electron');
const remote = electron.remote;
const { dialog } = remote;
const { shell } = window.require('electron');
const { ipcRenderer } = electron;




function Encryption() {

    var listOfFiles = [];
    const [coverImage, setCoverImage] = useState();
    const [listFiles, setListFiles] = useState(listOfFiles);
    const [password, setPassword] = useState();


    let complete_data = {
        _coverImage: coverImage,
        _listFiles: listFiles,
        _password: password
    }

    const handleEncryption = () => {


        console.log(JSON.stringify(complete_data))

        ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
            console.log(args);
        });

        ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
            number: JSON.stringify(complete_data)
        });

    }

    const addFileToList = (file) => {

        setListFiles(listFiles => [...listFiles, file]);
        /*listFiles.push(files.filePaths[i]);*/
    }

    const deleteFileFromList = (fileToDelete) => {
        setListFiles(listFiles.filter(item => item !== fileToDelete))
    };

    const showInFolder = () => {
        shell.showItemInFolder(coverImage);
    }

    const previewFile = () => {
        shell.openPath(coverImage);
    }

    const openFilesToConvert = () => {
        dialog.showOpenDialog(
            {
                title: 'Select Files',
                message: 'Select Files to Encrypt',
                //pass 'openDirectory' to strictly open directories
                properties: ['openFile', 'multiSelections'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
                ]
            }
        ).then(result => {
            var i;
            for (i = 0; i < result.filePaths.length; i++) {
                addFileToList(result.filePaths[i]);
            };
        })
    }

    const openCoverImage = () => {
        console.log('Test');
        dialog.showOpenDialog(
            {
                title: 'Cover Image',
                message: 'Select Cover Photo',
                //pass 'openDirectory' to strictly open directories
                properties: ['openFile'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
                ]
            }
        ).then(result => {
            setCoverImage(result.filePaths[0]);
        })
    }

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
            <Grid container direction="row" alignItems="center" style={{ marginTop: "15px" }}  >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Paper elevation={3} style={{ padding: "20px" }}>
                        <Typography variant="h4" style={{ float: "left", fontWeight: "medium" }}>Encryption</Typography>
                        <Grid container direction="row" alignItems="flex-start" style={{ marginTop: "10px" }}>
                            <Grid item xs={6} sm={7} md={7} lg={6} xl={6} style={{ paddingRight: "10px" }}>
                                <Typography variant="subtitle2">
                                    FILES
                                    </Typography>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >

                                        <Accordion style={{ backgroundColor: "#0c0d0e" }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                                                {
                                                    listFiles.length > 0 ?
                                                        <Typography variant="body1"> {listFiles.length} files Selected</Typography>
                                                        :
                                                        <Typography variant="body1">No Files Selected</Typography>
                                                }
                                            </AccordionSummary>
                                            <AccordionDetails variant='contained'>
                                                {
                                                    listFiles.length > 0 ?
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>File</TableCell>
                                                                        <TableCell align="right">Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        listFiles.map((file, i) => {
                                                                            console.log(file)
                                                                            return (
                                                                                <TableRow key={file}>
                                                                                    <TableCell component="th" scope="row">
                                                                                        {
                                                                                            // eslint-disable-next-line
                                                                                            file.replace(/^.*[\\\/]/, '')
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell align="right">
                                                                                        <IconButton onClick={() => deleteFileFromList(file)} color="primary" component="span">
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => shell.showItemInFolder(file)} color="primary" component="span">
                                                                                            <FolderOpenIcon />
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => shell.openPath(file)} color="primary" component="span">
                                                                                            <LaunchIcon />
                                                                                        </IconButton>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        : <Typography variant="subtitle2">Nothing Here!</Typography>
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                                <Button variant="contained" onClick={openFilesToConvert} style={{ color: "black", marginTop: "10px", backgroundColor: "#ffd6a5" }} elevation={5} >Add Files to encrypt</Button>
                            </Grid>
                            <Grid item xs={6} sm={5} md={5} lg={6} xl={6} style={{ paddingLeft: "10px" }}>
                                <Typography variant="subtitle2">
                                    COVER IMAGE
                                    </Typography>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Accordion style={{ backgroundColor: "#0c0d0e" }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                                                {
                                                    coverImage ?
                                                        <Typography variant="body1">
                                                            {
                                                                // eslint-disable-next-line 
                                                                coverImage.replace(/^.*[\\\/]/, '')
                                                            }
                                                        </Typography>
                                                        :
                                                        <Typography variant="body1">No Image Selected</Typography>
                                                }
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {
                                                    coverImage ?
                                                        <div>
                                                            <Typography variant="body1"><b>Image:</b>
                                                                {
                                                                    // eslint-disable-next-line 
                                                                    coverImage.replace(/^.*[\\\/]/, '')
                                                                }
                                                            </Typography>
                                                            <Typography variant="body1"><b>Path:</b> {coverImage}</Typography>
                                                            <ButtonGroup color="primary" aria-label="outlined primary button group" style={{ marginTop: '10px' }}>
                                                                <Button onClick={previewFile} elevation={5}>Open Image</Button>
                                                                <Button onClick={showInFolder} elevation={5}>Show in Folder</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                        :
                                                        <Typography variant="body1">Nothing Here!</Typography>
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                                <Button preventDefault variant="contained" onClick={openCoverImage} style={{ color: "black", backgroundColor: "#ffd6a5", marginTop: "10px" }} elevation={5}>Pick cover image</Button>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" alignItems="flex-end" style={{ marginTop: "20px" }}>
                            <Grid item xs={6} sm={7} md={7} lg={6} xl={6} style={{ paddingRight: "10px" }}>
                                <Typography variant="h6">Password</Typography>
                                <TextField
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    id="password"
                                    label="Enter Password"
                                    variant="outlined"
                                    style={{ width: "100%", marginTop: "5px" }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={5} md={5} lg={6} xl={6} style={{ paddingLeft: "10px" }}>
                                <Button onClick={handleEncryption} variant="contained" size="large" style={{ color: "black", backgroundColor: "#d0d1ff", marginTop: "10px" }} elevation={5}>Start File Encryption</Button>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider >
    );
}

export default Encryption;
