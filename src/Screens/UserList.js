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
import ConversationItem from './../Components/conversationcard';
import firestore from '@react-native-firebase/firestore';
import {guidGenerator} from '../Functions/messageIdGenerator';
import Add_icon from '../Assets/add.png';
import useGetConversations from '../Hooks/useGetConversations';
import {useSelector} from 'react-redux';

const Item = ({element}) => {
  const {uid, displayName} = auth().currentUser;
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
  // const [conversations, setConversations] = useState([]);
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

  useGetConversations();

  const conversations = useSelector(state => state.conversations);
  console.log('conversations========> ', conversations.conversation_data);

  return (
    <View style={styles.container}>
      {console.log(
        'convo length=====> ',
        conversations.conversation_data.length,
      )}
      {conversations.conversation_data.length > 0 ? (
        <FlatList
          scrollEnable={true}
          data={conversations.conversation_data}
          renderItem={({item}) => {
            return (
              <View>
                <ConversationItem element={item} />
              </View>
            );
          }}
          keyExtractor={item => item.id}
        />
      ) : null}
      <FlatList
        scrollEnable={true}
        data={users}
        renderItem={({item}) => {
          return (
            <View>{item._data._id != uid && <Item element={item} />}</View>
          );
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
  profileIconStyle: {
    width: wp(25),
    height: hp(12),
  },
  addIconStyle: {
    width: wp(15),
    height: hp(4),
    resizeMode: 'contain',
  },
  usernametext: {
    fontSize: wp(5),
    color: 'black',
  },
  useremailtext: {
    color: '#808080',
  },
});
