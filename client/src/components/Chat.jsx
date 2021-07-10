import React, { useState, useContext, useEffect, useRef } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Modal from 'simple-react-modal';
import ChatIcon from '@material-ui/icons/Chat';
import CancelIcon from '@material-ui/icons/Cancel';
import GetAppIcon from '@material-ui/icons/GetApp';
import { SocketContext } from '../SocketContext';
import { makeStyles } from '@material-ui/core/styles';
import ScrollToBottom from 'react-scroll-to-bottom';
import chatlogo from '../assets/chatlogo.png';
import './Chat.css';

const useStyles = makeStyles((theme) => ({

  Modal: {
    height: '100%',
    width: '100%',
  },

  infoBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    background: '#9042F5',
    borderRadius: '8px',
    height: '60px',
    width: '100%',
  },
  
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderRadius: '8px',
    height: '100%',
    width: '100%',
  },

  form: {
    display: 'flex',
    border: '2px solid #D3D3D3',
  },

  sendButton: {
    color: '#fff',
    background: '#2979FF',
    padding: '20px',
    display: 'inline-block',
    border: 'none',
    width: '20%',
  },

  input: {
    border: 'none',
    borderRadius: '0',
    padding: '5%',
    width: '70%',
    fontSize: '1.2em',
  },

  msg_sent: {
    alignSelf: 'flex-end',
  },

  mess: {
    padding: '5% 0',
    overflow: 'auto',
    height: '100%',
    maxHeight: '250px',
  },

}));


const Chat = () => {
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const classes = useStyles();
      const { sendMsg, chat, } = useContext(SocketContext);
      const [curMsg, setCurMsg] = useState("");
      const [downloadLink, setDownloadLink] = useState('');
      const [showLink, setShowLink] = useState(false);
      const newchat = useRef();

      /*Displaying latest chat */
      useEffect(() => {
        if (newchat?.current) newchat.current.scrollIntoView({ behavior: "smooth" });
      }, [chat]);

      /*Handling enter*/
      const onEnter = (event) => {
        event.preventDefault();
        onSend();
      };

      /*Sending message */
      const onSend = () => {
        if (curMsg && curMsg.length) sendMsg(curMsg);
        setCurMsg("");
      };

      /*Creating downloadable chat log file */

      const makeTextFile = () => {
        const log=JSON.stringify(chat, null, 2);
        const data = new Blob([log], { type: 'text/plain' });
        if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
        setDownloadLink(window.URL.createObjectURL(data));
      };

      const getLink = () => {
        makeTextFile();
        setShowLink(true);
        setTimeout(() => {
          setShowLink(false);
        }, 10000);
      };

      useEffect(() => {
        makeTextFile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

  return (
    <>
    {/*Chat box expands on click */}
      <ButtonGroup class="btn-toolbar" variant="contained">
        <Button variant="contained" color="secondary" size="lg" startIcon={<ChatIcon />} onClick={handleShow}>Chat</Button>
        <Button variant="contained" color="secondary" size="lg" startIcon={<GetAppIcon />} onClick={getLink}>Chat Log</Button>
      </ButtonGroup>

            {/*Link to download chat log */}
            {showLink?<a style={{color: "yellow", fontSize: "large"}} download="chatlog.txt" href={downloadLink}>Download Chat log</a>:null}

      <Modal
      closeOnOuterClick={true}
      show={show}
      onClose={handleClose}
      containerStyle={{height: 'auto', display: 'flex', borderRadius: '8px',}}>

      <div className={classes.container}>

        <div className={classes.infoBar}>
          <h2>CHAT</h2>
        </div>

      {/*Chat container */}
          <ScrollToBottom>
          {chat.length>0 ? (
                    <div className={classes.mess}>
                      {chat.map((msg) => (
                        <div
                          className={msg.type === "sent" ? classes.msg_sent : classes.msg_rcv}
                        >
                        {/*Sent and recieved messages */}
                          {msg.type === "sent" ? (
                            <div className="messageContainer justifyEnd">
                              <p className="sentText pr-10">{msg.sender}</p>
                              <div className="messageBox backgroundBlue">
                                <p className="messageText colorWhite">{msg.msg}</p>
                              </div>
                            </div>
                          ):(
                            <div className="messageContainer justifyStart">
                              <div className="messageBox backgroundLight">
                                <p className="messageText colorDark">{msg.msg}</p>
                              </div>
                              <p className="sentText pl-10 ">{msg.sender}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      <div ref={newchat} style={{border:'none'}}></div>
                    </div>
                  ) : (
                    <div>
                    {/*If chat is empty */}
                      <img src={chatlogo} alt="" width="150" height="150"/>
                      no messages
                    </div>
                  )}
          </ScrollToBottom>  

        {/*Chat Input */}      
        <form className={classes.form}>
          <input
            className={classes.input}
            type="text"
            placeholder="Type a message..."
            value={curMsg}
            onChange={(e) => setCurMsg(e.target.value)}
            onKeyPress={(event) => event.key === 'Enter' ? onEnter(event) : null}
          />
          <Button variant="contained" color="primary" className={classes.sendButton} onClick={onSend}>SEND</Button>
        </form>

            {/*Closing chat box */}
            <Button variant="contained" color="primary" startIcon={<CancelIcon />} onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    </>
  );
};

export default Chat;
