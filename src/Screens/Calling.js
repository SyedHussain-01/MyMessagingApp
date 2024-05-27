import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
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

const Phonecall = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startWebcam = async () => {
    try {
      pc.current = new RTCPeerConnection(servers);
      const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      local.getTracks().forEach(track => {
        pc.current.addTrack(track, local);
      });
      setLocalStream(local);

      const remote = new MediaStream();
      setRemoteStream(remote);

      pc.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          remote.addTrack(track);
        });
      };

      pc.current.oniceconnectionstatechange = () => {
        if (pc.current.iceConnectionState === 'connected') {
          console.log('ICE Connection State: connected');
        }
      };
    } catch (error) {
      console.log('Error starting webcam: ', error);
    }
  };

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        console.log('New ICE candidate: ', event.candidate);
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    // Create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({offer});

    // Listen for remote answer
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription).catch(e => {
          console.log('Failed to set remote answer: ', e);
        });
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data)).catch(e => {
            console.log('Failed to add ICE candidate: ', e);
          });
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        console.log('New ICE candidate: ', event.candidate);
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    if (!channelDocument.exists) {
      console.error('Channel does not exist');
      return;
    }

    const channelData = channelDocument.data();
    const offerDescription = channelData.offer;

    await pc.current
      .setRemoteDescription(new RTCSessionDescription(offerDescription))
      .catch(e => {
        console.log('Failed to set remote description: ', e);
      });

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelDoc.update({answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data)).catch(e => {
            console.log('Failed to add ICE candidate: ', e);
          });
        }
      });
    });
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <SafeAreaView>
        <View style={{width: '100%', height: '100%'}}>
          {console.log('local stream=============> ', localStream)}
          {localStream && (
            <RTCView
              streamURL={localStream?.toURL()}
              style={{width: '100%', height: '50%'}}
              objectFit="cover"
              mirror
            />
          )}
          {console.log('remote=============> ', remoteStream)}
          {remoteStream && (
            <RTCView
              streamURL={remoteStream?.toURL()}
              style={{width: '100%', height: '50%'}}
              objectFit="cover"
              mirror
            />
          )}
          <View>
            {!webcamStarted && (
              <Button
                title="Start webcam"
                onPress={async () => {
                  await startWebcam();
                  setWebcamStarted(true);
                }}
              />
            )}
          </View>
          <View
            style={{
              width: '100%',
              height: '30%',
              backgroundColor: 'red',
              position: 'absolute',
              bottom: 0,
            }}>
            {console.log({webcamStarted})}
            {webcamStarted && (
              <Button color={'red'} title="Start call" onPress={startCall} />
            )}
            {webcamStarted && (
              <View style={{flexDirection: 'row'}}>
                <Button title="Join call" onPress={joinCall} />
                <TextInput
                  value={channelId}
                  placeholder="callId"
                  minLength={45}
                  style={{borderWidth: 1, padding: 5}}
                  onChangeText={newText => setChannelId(newText)}
                />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Phonecall;
