import {StyleSheet, Image, View} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RenderMessageVideo = (video: any) => {
  return (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: video?.currentMessage?.video}} // Can be a URL or a local file.
        paused={false} // make it start
        style={styles.backgroundVideo} // any style you want
        repeat={true} // make it a loop
        controls={true}
        onError={(err: any) => console.log(err)} // Callback when video cannot be loaded
        resizeMode="contain"
      />
    </View>
  );
};

export default RenderMessageVideo;

const styles = StyleSheet.create({
  videoContainer: {
    height: hp(30),
    backgroundColor: 'black',
    marginBottom: hp(2),
  },
  backgroundVideo: {
    flex: 1,
    width: wp('70%'),
  },
});
