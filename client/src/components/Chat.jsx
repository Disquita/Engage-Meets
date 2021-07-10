import React, { useState, useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'simple-react-modal';
import ChatIcon from '@material-ui/icons/Chat';
import CancelIcon from '@material-ui/icons/Cancel';
import { SocketContext } from '../SocketContext';
import { makeStyles } from '@material-ui/core/styles';
import ScrollToBottom from 'react-scroll-to-bottom';
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
    const { name, sendMsg: sendMsgFunc,
      msgRcv,
      chat,
      setChat, } = useContext(SocketContext);
      const [sendMsg, setSendMsg] = useState("");

      const dummy = useRef();

      useEffect(() => {
        if (dummy?.current) dummy.current.scrollIntoView({ behavior: "smooth" });
      }, [chat]);

      const onSearch = (value) => {
        if (sendMsg && sendMsg.length) sendMsgFunc(sendMsg);
        setSendMsg("");
      };

    
  return (
    <>
      <Button variant="contained" color="primary" startIcon={<ChatIcon />} onClick={handleShow}>Chat</Button>
      <Modal
      closeOnOuterClick={true}
      show={show}
      onClose={handleClose}
      containerStyle={{height: 'auto', display: 'flex', borderRadius: '8px',}}>
      <div className={classes.container}>
      <div className={classes.infoBar}>
        <h2>CHAT</h2>
      </div>
      <ScrollToBottom>
      {chat.length>0 ? (
                 <div className={classes.mess}>
                  {chat.map((msg) => (
                    <div
                      className={msg.type === "sent" ? classes.msg_sent : classes.msg_rcv}
                    >
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
                  <div ref={dummy} style={{border:'none'}}></div>
                </div>
              ) : (
                <div>
                  no message
                </div>
              )}
      </ScrollToBottom>        
      <form className={classes.form}>
        <input
          className={classes.input}
          type="text"
          placeholder="Type a message..."
          value={sendMsg}
          onChange={(e) => setSendMsg(e.target.value)}
          onKeyDown={(event) => event.key === 'Enter' ? {onSearch} : null}
        />
        <Button variant="contained" color="primary" className={classes.sendButton} onClick={onSearch}>SEND</Button>
      </form>
      <Button variant="contained" color="primary" startIcon={<CancelIcon />} onClick={handleClose}>Close</Button>
      </div>
      </Modal>
    </>
  );
};

export default Chat;
