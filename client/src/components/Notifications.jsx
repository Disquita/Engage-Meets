import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { SocketContext } from '../SocketContext';
import ringtone from '../assets/ringtone.mp3'

const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);
    const [audio] = useState( typeof Audio !== "undefined" && new Audio(ringtone));
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        isPlaying ? audio.play() : audio.pause();
      },
      [isPlaying, audio]
    );
    const handleCancel = () => {
        window.location.reload();
      };
      useEffect(() => {
        if (call.isReceivingCall && !callAccepted) {
          setIsPlaying(true);
        } else setIsPlaying(false);
      }, [call.isReceivingCall, callAccepted]);

    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <h1>{call.name} is calling: </h1>
                <Button variant="contained" color="primary" onClick={answerCall}>
                    Answer
                </Button>
                <Button variant="contained" color="primary" onClick={handleCancel}>
                    Reject
                </Button>
                </div>
                </>
            )}
        </>
    );
};

export default Notifications;
