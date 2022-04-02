import React, {useState} from 'react';
import {Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import {Landing, SavedLocations, RecentDestinations, Header} from '../ToktokGoBookingStart/Sections';

const ToktokGoBookingStart = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE}}>
      <View>
        <Header navigation={navigation} />
        <Landing navigation={navigation} />
        <RecentDestinations navigation={navigation} />
        <View style={{borderBottomWidth: 6, borderBottomColor: constants.COLOR.LIGHT}} />
        <SavedLocations />
      </View>
    </View>
  );
};

export default ToktokGoBookingStart;
