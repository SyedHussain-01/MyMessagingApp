import {StyleSheet, TextInput} from 'react-native';
import React from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
}

const Input: React.FC<InputProps> = ({placeholder, value, onChange}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
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
  },
});