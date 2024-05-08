import {guidGenerator} from './messageIdGenerator';
import {launchImageLibrary} from 'react-native-image-picker';
import uploadFile from '../Functions/fileUploader';
import firestore from '@react-native-firebase/firestore';

export const onPressAction = async (
  uid: string,
  displayName: string,
  user_id: string,
  user_name: string,
  setMessages: Function,
  messages: any[],
  setTextInput: Function,
) => {
  try {
    const result: any = await launchImageLibrary({mediaType: 'mixed'});
    if (result && result.assets?.length != 0) {
      const fileUpload: any = await uploadFile(result.assets[0].uri);
      const filename = fileUpload.split('/')[7].split('?')[0].split('.');
      const ext = filename[filename.length - 1];
      const imageTypes = ['jpg', 'jpeg', 'png', 'svg'];
      const videoTypes = ['mp3', 'mp4'];
      const msgId = guidGenerator();
      const msgObj = {
        _id: msgId,
        createdAt: firestore.FieldValue.serverTimestamp(),
        party_ids: [uid, user_id],
        sender: {
          _id: uid,
          name: displayName,
        },
        reciever: {
          _id: user_id,
          name: user_name,
        },
        ...(imageTypes.includes(ext)
          ? {image: fileUpload}
          : videoTypes.includes(ext)
          ? {video: fileUpload}
          : {text: 'Unsupported Format'}),
      };
      firestore()
        .collection('Messages')
        .add(msgObj)
        .then(msg => {
          setMessages([
            ...messages,
            {
              _id: msgId,
              createdAt: new Date(),
              user: {
                _id: uid,
                name: displayName,
              },
              reciever: {
                _id: user_id,
                name: user_name,
              },
              ...(imageTypes.includes(ext)
                ? {image: fileUpload}
                : videoTypes.includes(ext)
                ? {video: fileUpload}
                : {text: 'Unsupported Format'}),
            },
          ]);
          setTextInput('');
        });
    }
  } catch (error) {
    console.log('outtttttt', error);
  }
};
