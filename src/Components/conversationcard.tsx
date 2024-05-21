import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Profile_avatar from '../Assets/gamer.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';

const Conversationcard = ({element}: any) => {
  const navigation = useNavigation();
  const {uid, displayName}: any = auth().currentUser;

  return (
    <View>
      <TouchableOpacity
        style={styles.userCard}
        onPress={() =>
          navigation.navigate('Conversation', {
            user_id: element._data._id,
            user_name: element._data.name,
          })
        }>
        <View style={styles.profilePicture}>
          <Image source={Profile_avatar} style={styles.profileIconStyle} />
        </View>
        <View style={styles.userName}>
          <Text style={styles.usernametext}>{element.reciever_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Conversationcard;

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    marginTop: hp(1),
    height: hp(16),
    width: wp('100%'),
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  profilePicture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },
  addIconSpace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: wp(4),
  },
  usernametext: {
    fontSize: wp(5),
    color: 'black',
  },
  useremailtext: {
    color: '#808080',
  },
  addIconStyle: {
    width: wp(15),
    height: hp(4),
    resizeMode: 'contain',
  },
  profileIconStyle: {
    width: wp(25),
    height: hp(12),
  },
});
