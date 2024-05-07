import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Profile_avatar from '../Assets/gamer.png';
import {useNavigation} from '@react-navigation/native';
import {getAllUsers} from '../Functions/getUsers';
import auth from '@react-native-firebase/auth';

const Item = ({element}) => {
  const navigation = useNavigation();
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
          <Text style={styles.usernametext}>{element._data?.name}</Text>
          <Text style={styles.useremailtext}>{element._data?.email}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const UserList = () => {
  const {uid} = auth().currentUser;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const user_list = await getAllUsers();
      setUsers(user_list);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnable={true}
        data={users}
        renderItem={({item}) => {
          return <View>{item._data._id != uid && <Item element={item} />}</View>;
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(4),
  },
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
  userName: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: wp(4),
  },
  profileIconStyle: {
    width: wp(25),
    height: hp(12),
  },
  usernametext: {
    fontSize: wp(5),
    color: 'black',
  },
  useremailtext: {
    color: '#808080',
  },
});
