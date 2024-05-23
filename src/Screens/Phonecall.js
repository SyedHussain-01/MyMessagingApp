import React, {useEffect, useRef, useState} from 'react';
import {View, Button, Text} from 'react-native';
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import {TextInput} from 'react-native-gesture-handler';
import axios from 'axios';

const Phonecall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callId, setCallId] = useState('');
  const [calleeId, setCalleeId] = useState('');
  const [isCaller, setIsCaller] = useState(false);

  const peerConnection = useRef(null);

  const getConfiguration = async () => {
    try {
      const response = await axios.get(
        'http://192.168.0.40:3000/turn-credentials?username=testuser',
      );
      const configuration = {
        iceServers: [
          {
            urls: 'turn:2407:aa80:15:103b:95b8:6352:b8c2:af17:3478',
            username: response.data.username,
            credential: response.data.password,
          },
        ],
      };
      console.log(configuration);
      peerConnection.current = new RTCPeerConnection(configuration.iceServers);
    } catch (error) {
      console.error('error=====================> ', error);
    }
  };

  useEffect(() => {
    getConfiguration();
  }, []);

  useEffect(() => {
    if (localStream) {
      localStream
        .getTracks()
        .forEach(track => peerConnection.current.addTrack(track, localStream));
      // Handle remote stream
      peerConnection.current.ontrack = event => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          firestore()
            .collection('calls')
            .doc(callId)
            .collection('iceCandidates')
            .add(event.candidate.toJSON());
        }
      };
    }
  }, [localStream]);

  const startLocalStream = async () => {
    const stream = await mediaDevices.getUserMedia({video: true, audio: true});
    setLocalStream(stream);
  };

  const createOffer = async () => {
    setIsCaller(true);
    const callRef = firestore().collection('calls').doc();
    setCallId(callRef.id);
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      await callRef.set({offer: {type: offer.type, sdp: offer.sdp}});

      callRef.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data && data.answer && !peerConnection.current.remoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          peerConnection.current.setRemoteDescription(answerDescription);
        }
      });

      callRef.collection('iceCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            peerConnection.current.addIceCandidate(candidate);
          }
        });
      });
    } catch (error) {
      console.error('error in create offer====> ', error);
    }
  };

  const answerCall = async incomingCallId => {
    setCallId(incomingCallId);
    const callRef = firestore().collection('calls').doc(incomingCallId);
    const callData = (await callRef.get()).data();
    if (callData && callData.offer) {
      try {
        const offerDescription = new RTCSessionDescription(callData.offer);
        await peerConnection.current.setRemoteDescription(offerDescription);

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        await callRef.update({answer: {type: answer.type, sdp: answer.sdp}});

        callRef.collection('iceCandidates').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              peerConnection.current.addIceCandidate(candidate);
            }
          });
        });
      } catch (error) {
        console.error('error in answer===========> ', error);
      }
    }
  };

  const handleIncomingCall = async () => {
    const callRef = firestore().collection('calls').doc(calleeId);

    callRef.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data && data.offer) {
        answerCall(callRef.id);
      }
    });

    callRef.collection('iceCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current.addIceCandidate(candidate);
        }
      });
    });
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{flex: 1}}>
        {localStream && !remoteStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={{width: '100%', height: '50%'}}
          />
        )}
        {localStream && remoteStream && (
          <>
            {console.log('remote stream=====> ', remoteStream)}
            {console.log('local stream=====> ', localStream)}
            <RTCView
              streamURL={localStream.toURL()}
              style={{width: '100%', height: '50%', marginBottom: 5}}
            />
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{width: '100%', height: '50%'}}
            />
          </>
        )}
      </View>
      <Button title="Start Local Stream" onPress={startLocalStream} />
      <Button title="Create Offer" onPress={createOffer} />
      <TextInput
        placeholder={'Set Calleee Id'}
        onChangeText={text => setCalleeId(text)}
        value={calleeId}
        autoCapitalize="none"
        style={{color: 'black', borderWidth: 2, borderColor: 'black'}}
        placeholderTextColor={'black'}
      />
      <Button title="Answer Call" onPress={handleIncomingCall} />
      {console.log(callId)}
      <Text style={{color: 'black'}}>Call ID: {callId}</Text>
    </View>
  );
};

export default Phonecall;
