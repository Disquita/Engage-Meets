import React, { useContext , useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone } from '@material-ui/icons';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../SocketContext';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    shares: {
      padding: '20px 20px',
      display: 'flex',
      justifyContent: 'center',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      width: '600px',
      margin: '35px 0',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: '10px 20px',
      border: '2px solid black',
    },
   }));

const Options = ( {children} ) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, calling } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const classes = useStyles();
    const [isCopied, setIsCopied] = useState(false);
    const link="http://localhost:3000/";
    const onCopyText = () => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    };
    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12} md={6} className={classes.padding}>
                        <Typography gutterBottom variant="h6">Meet Info</Typography>
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                        <CopyToClipboard text={me} onCopy={onCopyText} className={classes.margin}>
                          <div>
                            <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                            Copy Meeting ID
                            </Button>
                            {isCopied?<span> Copied </span>:<span></span>}
                          </div>  
                        </CopyToClipboard>
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.padding}>
                        <Typography gutterBottom variant="h6">Join a Meet</Typography>
                        <TextField label="Meet ID" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                        {callAccepted && !callEnded ? (
                            <Button variant="contained"
                             color="secondary" 
                             startIcon={<CallEndIcon 
                             fontSize="large" />} 
                             fullWidth 
                             onClick={leaveCall} 
                             className={classes.margin}>
                              End Call
                            </Button>
                          ) : (
                            <div>
                            <Button variant="contained" 
                            color="primary" 
                            startIcon={<Phone fontSize="large" />} 
                            fullWidth 
                            onClick={() => callUser(idToCall)} 
                            className={classes.margin}>
                              Enter Call
                            </Button>
                            {calling?<span> Calling </span>:<span></span>}
                            </div>
                          )}
                    </Grid>
                </Grid>    
                </form>
                {children}
                <div className={classes.shares}>
                  <EmailShareButton
                      url={link}
                      title={"Join my Call with code: " + String(me) +"\nLink: "}
                    >
                      <EmailIcon size={32} round={true} />
                  </EmailShareButton>
                  
                  <FacebookShareButton
                      url={link}
                      title={"Join my Call with code: " + String(me) +"\nLink: "}
                    >
                      <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  
                  <LinkedinShareButton
                      url={link}
                      title={"Join my Call with code: " + String(me) +"\nLink: "}
                    >
                      <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>
                 
                  <TelegramShareButton
                      url={link}
                      title={"Join my Call with code: " + String(me) +"\nLink: "}
                    >
                      <TelegramIcon size={32} round={true} />
                  </TelegramShareButton>

                  <TwitterShareButton
                      url={link}
                      title={"Join my Call with code: " + String(me) +"\nLink: "}
                    >
                      <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>

                  <WhatsappShareButton
                    url={link}
                    title={"Join my Call with code: " + String(me) +"\nLink: "}
                  >
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>
                </div>
            </Paper>
        </Container>
    );
};

export default Options;
