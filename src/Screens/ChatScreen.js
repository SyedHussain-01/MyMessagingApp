import {StyleSheet, Text, FlatList, TouchableOpacity, View} from 'react-native';
import {getAllUsers} from '../Functions/getUsers';
import React, {useEffect, useState} from 'react';
import {signOut} from '../Functions/auth';
import {useNavigation} from '@react-navigation/native';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>
      {item.item._data.name}
    </Text>
  </TouchableOpacity>
);

const ChatScreen = () => {
  const navigation = useNavigation();
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

  const renderItem = item => {
    return (
      <Item
        item={item}
        onPress={() => navigation.navigate('Conversation')}
        backgroundColor={'#fff'}
        textColor={'#000'}
      />
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View>
      {/* <TouchableOpacity onPressIn={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
