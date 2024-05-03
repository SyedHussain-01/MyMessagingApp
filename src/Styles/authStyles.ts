import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const authstyles = StyleSheet.create({
  container: {
    flex: 1,
    gap: hp(3),
  },
  loginHeaderSpace: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    gap: hp(1),
  },
  loginInputSpace: {
    flex: 3,
    alignItems: 'center',
    gap: hp(2.2),
  },
  iconStyle: {
    width: wp(30),
    height: hp(15),
  },
  loginHeaderText: {
    fontSize: wp(5.5),
    fontWeight: '500',
    padding: hp(0.5),
  },
  footerStyle: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(1),
  },
  footerLeft: {
    fontSize: wp(3),
  },
  footerRight: {
    fontSize: wp(3),
    color: '#f85100',
  },
});

export default authstyles;
