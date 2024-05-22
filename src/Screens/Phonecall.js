// 'http://192.168.0.40:3000/turn-credentials?username=testuser',
// const configuration = {
//   iceServers: [
//     {
//       urls: 'turn:192.168.0.40:3478',
//       username: response.data.username,
//       credential: response.data.password,
//     },
//   ],

import {StyleSheet, Text, View, Image} from 'react-native';
import PhoneRecieve from '../Assets/phone-call.png';
import PhoneDecline from '../Assets/phone-decline.png';
import Call from '../Assets/time-call.png';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import getStream from '../Functions/getStream';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useRef, useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';

const Phonecall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [greetingCall, setGreetingCall] = useState(false);
  const pc = useRef();
  const connecting = useRef(false);

  const setup = async () => {
    try {
      const response = await axios.get(
        'http://192.168.0.40:3000/turn-credentials?username=testuser',
      );
      const configuration = {
        iceServers: [
          {
            urls: 'turn:192.168.0.40:3478',
            username: response.data.username,
            credential: response.data.password,
          },
        ],
      };
      console.log('TURN server connected');
      pc.current = new RTCPeerConnection(configuration);
      const stream = await getStream();
      if (stream) {
        setLocalStream(stream);
        // pc.current.onaddstream(stream);
        stream.getTracks().forEach(track => {
          pc.current.addTrack(track, stream);
        });
      }

      pc.current.ontrack = event => {
        console.log('event=================================> ', event);
        setRemoteStream(event.streams[0]);
      };
    } catch (error) {
      console.error('Error fetching TURN credentials:', error);
    }
  };

  //this will be called from the iconon header which will create the connection
  const create = async () => {
    connecting.current = true;
    setup();
    // get document for call
    const cRef = firestore().collection('meet').doc('chatId');
    // exchange ICE candidated b/w caller and callee
    collectICECandidates(cRef, 'caller', 'callee');
    if (pc.current) {
      const offer = pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        type: offer.type,
        sdp: offer.sdp,
      };

      //set cWithOffer in firestore in that document
      try {
        await firestore().collection('meet').doc('chatId').set(cWithOffer);
      } catch (error) {
        console.log('error==============> ', error);
      }
    }
  };
  const join = async () => {
    connecting.current = true;

    setGreetingCall(false);

    // get doc
    const cRef = firestore().collection('meet').doc('chatId');

    //get doc from that offer
    const offer = (await cRef.get()).data()?.offer;

    if (offer) {
      await setup();
      //collect candidates
      collectICECandidates(cRef, 'callee', 'caller');
      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);

        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        //add cWithAnswer in doc
        cRef.update(cWithAnswer);
      }
    }
  };
  const hangup = () => {
    connecting.current = false;
    //streamCleanUp()
    //fireStoreCleanup()
    if (pc.current) {
      pc.current.close();
    }
  };
  const collectICECandidates = (cRef, localName, remoteName) => {
    const candidateCollection = cRef.collection(localName);
    if (pc.current) {
      pc.current.onicecandidate = event => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }

    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current.addIceCandidate(candidate);
        }
      });
    });
  };

  if (greetingCall) {
    return (
      <View>
        {/* hangup join will be used */}
        <Text>Greeetinggg...........</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {localStream && !remoteStream && (
        // hangup localStream remoteStream will be used in RTCView
        <RTCView streamURL={localStream.toURL()} style={styles.video} />
      )}
      {localStream && remoteStream && (
        // hangup localStream remoteStream will be used in RTCView
        <>
          <RTCView streamURL={remoteStream.toURL()} style={styles.localvideo} />
          <RTCView streamURL={localStream.toURL()} style={styles.remotevideo} />
        </>
      )}
      <View style={styles.footer}>
        <TouchableOpacity onPress={join}>
          <Image source={PhoneRecieve} style={styles.icons} />
        </TouchableOpacity>
        <TouchableOpacity onPress={create}>
          <Image source={Call} style={styles.icons} />
        </TouchableOpacity>
        <TouchableOpacity onPress={hangup}>
          <Image source={PhoneDecline} style={styles.icons} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Phonecall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: hp(2),
    flexDirection: 'row',
    alignSelf: 'center',
    gap: wp(5),
  },
  icons: {
    width: wp(12),
    height: hp(12),
    resizeMode: 'contain',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoremote: {
    width: '100%',
    height: '50%',
  },
  videolocal: {
    width: '100%',
    height: '50%',
  },
});
