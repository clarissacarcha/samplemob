import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash.png';

const ToktokGoLanding = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('ToktokGoHealthCare');
    }, 3000);
  }, []);

  return (
    <View style={styles.content}>
      <Image source={toktokgoSplash} style={{width: 200, height: 200}} />
    </View>
  );
};

export default ToktokGoLanding;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: constants.COLOR.BACKGROUND_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
