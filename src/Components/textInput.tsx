import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import React from 'react';

interface InputProps extends TextInputProps {
  onChangeInputText: (e: string) => void;
}

const Input: React.FC<InputProps> = props => {
  const {placeholder, value, onChangeInputText} = props;
  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      value={value}
      onChangeText={text => onChangeInputText(text)}
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
    color: 'black',
  },
});
