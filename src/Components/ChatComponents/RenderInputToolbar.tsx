import {StyleSheet, Image} from 'react-native';
import {InputToolbar, Composer} from 'react-native-gifted-chat';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const renderInputToolbar = (
  props: any,
  textInput: string,
  setTextInput: Function,
) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputContainer}
      renderComposer={() => {
        return (
          <Composer
            textInputStyle={styles.inputStyle}
            onTextChanged={text => setTextInput(text)}
            text={textInput}
          />
        );
      }}
    />
  );
};

export default renderInputToolbar;

const styles = StyleSheet.create({
  inputContainer: {
    color: 'black',
    width: '90%',
    marginLeft: wp(5),
    marginRight: wp(5),
    borderRadius: 24,
    borderTopColor: 'transparent',
  },
  inputStyle: {
    color: 'black',
    backgroundColor: 'transparent',
    padding: 5,
  },
});
