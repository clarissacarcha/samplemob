import React from 'react';
import {View, Text, Image} from 'react-native';

import CustomIcon from '../../../../../Components/Icons';

export const EmptyList = ({image, title, titleStyle}) => {
  return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Image {...image}/>
        <Text style={[{marginTop: 20,fontSize: 15, color: 'rgba(158, 158, 158, 1)'}, titleStyle]}>{title}</Text>
      </View>
  );
};
