import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {GestureResponderEvent} from 'react-native';

interface ButtonProps {
  text: string;
  action: (event: GestureResponderEvent) => void;
}

const Button: React.FC<ButtonProps> = ({text = '', action = () => {}}) => {
  return (
    <TouchableOpacity style={styles.btnStyle} onPressIn={action}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: '#f85100',
    width: '80%',
    padding: 15,
    borderRadius: 24,
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: '700',
  },
});
