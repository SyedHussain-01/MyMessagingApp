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
import {useNavigation, Link} from '@react-navigation/native';
import {getAllUsers} from '../Functions/getUsers';

const Item = ({element}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPressIn={() =>
        navigation.navigate('Conversation', {
          user_id: element.id,
        })
      }>
      <View style={styles.userCard}>
        <View style={styles.profilePicture}>
          <Image source={Profile_avatar} style={styles.profileIconStyle} />
        </View>
        <View style={styles.userName}>
          <Text style={styles.usernametext}>{element._data?.name}</Text>
          <Text style={styles.useremailtext}>{element._data?.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const UserList = () => {
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
    <View style={styles.container} elevation={5}>
      <FlatList
        scrollEnable={true}
        data={users}
        renderItem={({item}) => <Item element={item} />}
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
    paddingTop: hp(8),
  },
  userCard: {
    flexDirection: 'row',
    marginTop: hp(2),
    height: hp(20),
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
    width: wp(28),
    height: hp(13),
  },
  usernametext: {
    fontSize: wp(5),
  },
  useremailtext: {
    color: '#808080',
  },
});
