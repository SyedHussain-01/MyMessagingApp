import {StyleSheet, Text, View, Image} from 'react-native';
import PhoneRecieve from '../Assets/phone-call.png';
import PhoneDecline from '../Assets/phone-decline.png';
import {
  MediaStream,
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
import React, {useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Phonecall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [greetingCall, setGreetingCall] = useState(false);
  const pc = useRef();
  const connecting = useRef(false);

  const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};

  const start = async () => {
    console.log('start');
    if (!localStream) {
      try {
        const s = await mediaDevices.getUserMedia({video: true});
        setLocalStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
    if (localStream) {
      localStream.release();
      setLocalStream(null);
    }
  };

  const setup = async () => {
    pc.current = new RTCPeerConnection(configuration);

    const stream = await getStream();
    if (stream) {
      setLocalStream(stream);
      pc.current.onAddStream(stream);
    }

    pc.current.onAddStream = event => {
      setRemoteStream(event.stream);
    };
  };

  //this will be called from the iconon header which will create the connection
  const create = async () => {
    connecting.current = true;
    await setup();

    // get document for call

    // exchange ICE candidated b/w caller and callee

    if (pc.current) {
      const offer = pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        type: offer.type,
        sdp: offer.sdp,
      };
    }

    //set cWithOffer in firestore in that document
  };
  const join = async () => {
    connecting.current = true;

    setGreetingCall(false);

    // get doc

    //get doc from that offer
    const offer = {};

    if (offer) {
      await setup();
      //collect candidates
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
          <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
          <RTCView streamURL={localStream.toURL()} style={styles.video} />
        </>
      )}
      <View style={styles.footer}>
        <TouchableOpacity onPress={join}>
          <Image source={PhoneRecieve} style={styles.icons} />
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
});
