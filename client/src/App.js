import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import styles from './styles.css';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';
import Chat from './components/Chat';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    image: {
      marginLeft: '15px',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));

const App = () => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <AppBar position="static" color="primary" className={classes.appBar}>
                <Typography className={styles.bigheading} variant="h2" align="center">
                👥
                Engage Meetings
                </Typography>
            </AppBar>
            <VideoPlayer />
            <Chat />
            <Options>
                <Notifications />
            </Options>
        </div>
    );
};

export default App;
