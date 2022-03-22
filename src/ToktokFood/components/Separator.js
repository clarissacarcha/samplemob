import React from 'react';
import {View} from 'react-native';

const Separator = ({style}) => {
  return <View style={{height: 8, width: '100%', backgroundColor: '#F7F7FA', ...style}} />;
};
export default Separator;
