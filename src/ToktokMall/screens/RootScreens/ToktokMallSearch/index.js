import React from 'react';
import {View, Text} from 'react-native';
import {LandingSubHeader} from '../../../Components';

export const ToktokMallSearch = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LandingSubHeader />
      <View style={{flex: 1}}>
        <Text>Search History</Text>
      </View>
    </View>
  );
};
