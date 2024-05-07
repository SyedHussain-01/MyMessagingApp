import {StyleSheet, TextInput} from 'react-native';
import React from 'react';

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: string) => void;
}

const Input: React.FC<InputProps> = ({placeholder, value, onChange}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={text => onChange(text)}
      style={styles.inputStyle}
      placeholderTextColor="#504742"
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  inputStyle: {
    width: '80%',
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#fee4d8',
    color:'black'
  },
});
