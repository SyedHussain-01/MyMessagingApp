import storage from '@react-native-firebase/storage';

const uploadFile = async (imagepath: string) => {
  try {
    const ext = imagepath.split('.').pop();
    const fileUrl = imagepath.substring(imagepath.lastIndexOf('/') + 1);
    let ref = storage().ref(`/chatPhoto/${fileUrl}.${ext}`);
    await ref.putFile(imagepath);
    const url = await storage()
      .ref(`/chatPhoto/${fileUrl}.${ext}`)
      .getDownloadURL();
    return url;
  } catch (e) {
    console.log({e});
  }
};

export default uploadFile;
