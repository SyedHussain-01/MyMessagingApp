import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const authenticate = (email: any, password: any, name: any) => {
  try {
    let user_id: string;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user_id = user.user.uid
        user.user.updateProfile({
          displayName: name
        })
        console.log('User account created & signed in!');
      })
      .then(() => {
        firestore().collection('Users').add({
          _id: user_id,
          name,
          email,
          password,
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.log('error');
      });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
  console.log(email, password)
  try {
    let result;
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User Signed In Successfully');
        result = true;
      })
      .catch(error => {
        console.log('error====> ', error);
      });
    if (result === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const signOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};
