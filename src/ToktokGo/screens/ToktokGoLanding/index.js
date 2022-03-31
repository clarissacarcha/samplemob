import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash.png';
import {Landing, SavedLocations, RecentDestinations, Header} from './Sections';

const ToktokGoLanding = ({navigation}) => {
  const [accept, setAccept] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('ToktokGoHealthCare');
    }, 3000);
  }, []);

  return (
    <View style={styles.content}>
      {!accept ? (
        <Image source={toktokgoSplash} style={{width: 200, height: 200}} />
      ) : (
        <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE}}>
          <View>
            <Header navigation={navigation} />
            <Landing navigation={navigation} />
            <RecentDestinations />
            <View style={{borderBottomWidth: 6, borderBottomColor: constants.COLOR.LIGHT}} />
            <SavedLocations />
          </View>
        </View>
      )}
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
