import React from 'react';
import {Text, View} from 'react-native';

const NearbyStores = ({navigation, route}) => {
  const {label, placeType} = route.params;
  return (
    <View>
      <Text>Nearby {label}</Text>
    </View>
  );
};

export default NearbyStores;
