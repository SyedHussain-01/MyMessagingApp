import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const authenticate = (email: any, password: any, name: any) => {
  try {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .then(() => {
        firestore().collection('Users').add({
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
  try {
    let result;
    await firestore()
      .collection('Users')
      // Filter results
      .where('email', '==', email)
      .where('password', '==', password)
      .get()
      .then(querySnapshot => {
        console.log('ql=> ', querySnapshot.docs.length);
        if (querySnapshot.docs.length === 0) {
          result = false;
        } else {
          console.log('user coming');
          result = true;
        }
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
