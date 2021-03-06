import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../SocketContext';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const useStyles = makeStyles((theme) => ({

  root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
  },

  video: {
    width: '600px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },

  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '20px',
    background: 'black',
    color: 'white',
  },

  ButtonGroup: {
    background: 'violet',
    justifyContent: 'center',
  },

}));

/* Video call and related options rendering */
const VideoPlayer = () => {
    const { name, 
      callAccepted, 
      myVideo, 
      userVideo, 
      callEnded, 
      stream, 
      call, 
      myCamStatus, 
      updateVideo, 
      myMicStatus, 
      updateMic, 
      shareScreen, 
      myScreen, 
      uname, } = useContext(SocketContext);

    const classes = useStyles();

    /* Fullscreen function */
    const toggleFullScreen = () => {
      if(!callAccepted)
       return;
      var v = document.getElementById("usVideo");
      if (v.requestFullscreen) {
        v.requestFullscreen();
      } else if (v.msRequestFullscreen) {
        v.msRequestFullscreen();
      } else if (v.mozRequestFullScreen) {
        v.mozRequestFullScreen();
      } else if (v.webkitRequestFullscreen) {
        v.webkitRequestFullscreen();
      }
    };

    return (
      <div className={classes.root}>
          <Grid container className={classes.gridContainer}> 

          {/* Current user's video */}
          { stream &&(
                          <Paper className={classes.paper}>
                              <Grid item xs={5} md={3}>
                                  <Typography variant="h4" gutterBottom background_color="red">{name || 'My Name'}</Typography>
                                  <video playsInline muted ref={myVideo} autoPlay className={classes.video} 
                                    style={{
                                      opacity: `${myCamStatus ? "1" : "0"}`,
                                    }}
                                  />
                              </Grid>
                          </Paper>
          )}
          
          {/* Other user's video */}
          {callAccepted && !callEnded && (
                      <Paper className={classes.paper}>
                      <Grid item xs={12} md={6}>
                      {console.log(call.name)}
                          <Typography variant="h4" background_color="red" gutterBottom>{call.name || uname || 'Caller Name'}</Typography>
                          <video playsInline id="usVideo" ref={userVideo} autoPlay className={classes.video} />
                      </Grid>
                      </Paper>
          )}
          
          {/* Options List */}
          </Grid>
            <ButtonGroup class="btn-toolbar" variant="contained" color="primary" aria-label="contained primary button group" className={classes.buttons}>
              <Button startIcon={myMicStatus ?<MicIcon />:<MicOffIcon />} onClick={() => updateMic()}>{myMicStatus ?<span>Mute</span>:<span>Unmute</span>}</Button>
              <Button startIcon={myCamStatus ?<VideocamIcon />:<VideocamOffIcon />} onClick={() => updateVideo()}>{myCamStatus ?<span>Turn off Video</span>:<span>Turn on Video</span>}</Button>
              <Button startIcon={myScreen ?<ScreenShareIcon />:<StopScreenShareIcon />} onClick={() => shareScreen()}>{myScreen ?<span>Share Screen</span>:<span>Stop Sharing Screen</span>}</Button>
              <Button startIcon={<FullscreenIcon />} onClick={() => toggleFullScreen()}>Fullscreen</Button>
            </ButtonGroup>
          </div>
    );
};

export default VideoPlayer;
