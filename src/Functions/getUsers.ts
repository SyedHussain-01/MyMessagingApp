import firestore from '@react-native-firebase/firestore';

export const getAllUsers = async () => {
  try {
    let userList: object[] | undefined;
    await firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        userList = querySnapshot.docs;
      });
    return userList;
  } catch (error) {
    console.log(error);
  }
};
