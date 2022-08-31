import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import CustomIcon from '../../../../../Components/Icons';

export const EmptyList = ({image, title, titleStyle}) => {
  return (
      <View style={s}>
        <Image {...image}/>
        <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white'
  },
  textTitle: {
    marginTop: 20,
    fontSize: 15, 
    color: 'rgba(158, 158, 158, 1)'
  }
})