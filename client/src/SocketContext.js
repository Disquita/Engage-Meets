import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

/* Server side connection */
//const socket = io('http://localhost:5000');
const socket = io('https://engage-meets.herokuapp.com/');

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState();
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [myCamStatus, setmyCamStatus] = useState(true);
    const [userCamStatus, setuserCamStatus] = useState();
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userMicStatus, setUserMicStatus] = useState();
    const [myScreen, setMyScreen] = useState(true);
    const [otherUser, setOtherUser] = useState("");
  	const [chat, setChat ] = useState([]);
    const [uname, setUname] = useState("");
    const [calling, setCalling] = useState(false);
    var ss;
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

      socket.on('me', (id) => setMe(id));
      socket.on('callUser', ({ from, name: callerName, signal }) => {
          setCall({ isReceivingCall: true, from, name: callerName, signal });
      });

      socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
        if (currentMediaStatus !== null || currentMediaStatus !== []) {
          switch (type) {
            case "video":
              setuserCamStatus(currentMediaStatus);
              break;
            case "mic":
              setUserMicStatus(currentMediaStatus);
              break;
            default:
              setUserMicStatus(currentMediaStatus[0]);
              setuserCamStatus(currentMediaStatus[1]);
              break;
          }
        }
      });

      socket.on("recieveMsg", ({ name, msg: value, sender }) => {
        let msg = {};
        msg.msg = value;
        msg.type = "rcv";
        msg.sender = sender;
        msg.timestamp = Date.now();
        setChat(chat => [...chat, msg]);
      });


  }, []);


  /* Function to answer and join call */
  const answerCall = () => {
          setCallAccepted(true);
          const peer = new Peer({ initiator: false, trickle: false, stream });
          setOtherUser(call.from);
          peer.on('signal', (data) => {
          socket.emit('answerCall', { signal : data, to: call.from , uname: name, type: "both", myMediaStatus: [myMicStatus, myCamStatus]});
        });

          peer.on('stream', (currentStream) => {
            userVideo.current.srcObject= currentStream;
          });

          peer.signal(call.signal);
          connectionRef.current = peer;

  };


  /* Function to call user */
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
      setCalling(true);
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData : data, from: me, name });
      });
      setOtherUser(id);
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject= currentStream;
      });

      socket.on('callAccepted', ({signal, uname}) => {
          setCalling(false);
          setCallAccepted(true);
          setUname(uname);
          peer.signal(signal);
          socket.emit("updateMyMedia", {
            type: "both",
            currentMediaStatus: [myMicStatus, myCamStatus],
          });
      });
      connectionRef.current = peer;
  };

  /* Function managing change in camera status */
  const updateVideo = () => {
    setmyCamStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  /* Function managing change in microphone status */
  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };


  /* Function managing screen sharing */
  const shareScreen = () => {
    if(myScreen){
      navigator.mediaDevices.getDisplayMedia({cursor:true})
      .then(screenStream=>{
        myVideo.current.srcObject=screenStream; 
        ss=screenStream;
        if(callAccepted)
        connectionRef.current.replaceTrack(stream.getVideoTracks()[0],screenStream.getVideoTracks()[0],stream);
        setMyScreen(false);    
        screenStream.getTracks()[0].onended = () =>{
        myVideo.current.srcObject=stream;
        if(callAccepted)
        connectionRef.current.replaceTrack(screenStream.getVideoTracks()[0],stream.getVideoTracks()[0],stream);
        setMyScreen(true);
        }
      });
    }
    else{
      setMyScreen(true);
      ss=myVideo.current.srcObject;
      myVideo.current.srcObject=stream;
      if(callAccepted)
      connectionRef.current.replaceTrack(ss.getVideoTracks()[0],stream.getVideoTracks()[0],stream);
    }
  };

  /* Function managing chat */
  const sendMsg = (value) => {
    socket.emit("messageUser", { name, to: otherUser, msg: value, sender: name });
    let msg = {};
    msg.msg = value;
    msg.type = "sent";
    msg.timestamp = Date.now();
    msg.sender = name;
    setChat([...chat, msg]);
  };

  /* Function managing call termination */
  const leaveCall = () => {
      setCallEnded(true);
      connectionRef.current.destroy();
      window.location.reload();
  };

  return(
      <SocketContext.Provider value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        myCamStatus,
        setmyCamStatus,
        userCamStatus,
        setuserCamStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        shareScreen,
        myScreen,
        uname,
        calling,
        sendMsg,
        chat,
        setChat,
        setOtherUser,
      }}>
        {children}
      </SocketContext.Provider>
  );

};

export { ContextProvider, SocketContext };