import {mediaDevices} from 'react-native-webrtc';

const getStream = async () => {
  try {
    let isFront = true;
    const sourceInfos: any = await mediaDevices.enumerateDevices();
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const source = sourceInfos[i];
      if (
        source.kind == 'videoinput' &&
        source.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = source.deviceId;
      }
    }
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facing: isFront ? 'user' : 'environemnt',
        deviceId: videoSourceId,
      },
    });
    if (typeof stream != 'boolean') {
      return stream;
    }
    return null;
  } catch (error) {
    console.log('errrrr===> ', error);
  }
};

export default getStream;
