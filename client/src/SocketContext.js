import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');
//const socket = io('https://engage-meets.herokuapp.com/');

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState();
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [myVdoStatus, setMyVdoStatus] = useState(true);
    const [userVdoStatus, setUserVdoStatus] = useState();
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userMicStatus, setUserMicStatus] = useState();
    const [myScreen, setMyScreen] = useState(true);
    const [chat, setChat] = useState([]);
    const [msgRcv, setMsgRcv] = useState("");
    const [uname, setUname] = useState("");
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
              setUserVdoStatus(currentMediaStatus);
              break;
            case "mic":
              setUserMicStatus(currentMediaStatus);
              break;
            default:
              setUserMicStatus(currentMediaStatus[0]);
              setUserVdoStatus(currentMediaStatus[1]);
              break;
          }
        }
      });

      socket.on("msgRcv", ({ name, msg: value, sender }) => {
        setMsgRcv({ value, sender });
        setTimeout(() => {
          setMsgRcv({});
        }, 2000);
      });

}, []);

  const answerCall = () => {
          setCallAccepted(true);
          const peer = new Peer({ initiator: false, trickle: false, stream });

          peer.on('signal', (data) => {
          socket.emit('answerCall', { signal : data, to: call.from , uname: name, type: "both", myMediaStatus: [myMicStatus, myVdoStatus]});
        });

          peer.on('stream', (currentStream) => {
            userVideo.current.srcObject= currentStream;
          });

          peer.signal(call.signal);
          connectionRef.current = peer;

  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData : data, from: me, name });
      });

      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject= currentStream;
      });

      socket.on('callAccepted', ({signal, uname}) => {
          setCallAccepted(true);
          setUname(uname);
          peer.signal(signal);
          socket.emit("updateMyMedia", {
            type: "both",
            currentMediaStatus: [myMicStatus, myVdoStatus],
          });
      });
      connectionRef.current = peer;
  };

  const updateVideo = () => {
    setMyVdoStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };
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

  const sendMsg = (value) => {
    socket.emit("messageUser", { name, to: call.from, msg: value, sender: name });
    let msg = {};
    msg.msg = value;
    msg.type = "sent";
    msg.timestamp = Date.now();
    msg.sender = name;
    setChat([...chat, msg]);
  };

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
        myVdoStatus,
        setMyVdoStatus,
        userVdoStatus,
        setUserVdoStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        shareScreen,
        myScreen,
        sendMsg,
        msgRcv,
        chat,
        setChat,
        setMsgRcv,
        uname,
      }}>
        {children}
      </SocketContext.Provider>
  );

};

export { ContextProvider, SocketContext };