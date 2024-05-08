import {StyleSheet, Image} from 'react-native';
import {Actions} from 'react-native-gifted-chat';
import SendIcon from '../../Assets/send.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const renderActions = (props: any) => {
  return (
    <Actions {...props} containerStyle={styles.iconContainerStyle}>
      <Image source={SendIcon} style={styles.iconStyle} />
    </Actions>
  );
};

export default renderActions;

const styles = StyleSheet.create({
  iconContainerStyle: {
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    height: hp(3),
    width: wp(6),
  },
});
