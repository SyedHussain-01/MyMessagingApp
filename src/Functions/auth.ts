import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const authenticate = async (email: any, password: any, name: any) => {
  try {
    let user_id: string;
    const user = await auth().createUserWithEmailAndPassword(email, password);
    user_id = user.user.uid;
    user.user.updateProfile({
      displayName: name,
    });
    console.log('User account created & signed in!');
    await firestore().collection('Users').add({
      _id: user_id,
      name,
      email,
      password,
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        console.log('error====> ', error);
        reject(false);
      });
  });
};

export const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      console.log('successfully signed out');
    });
};