import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR, DARK, MEDIUM} from '../res/constants';
import FIcon from 'react-native-vector-icons/Feather';

import SomethingWrong from '../assets/images/SomethingWentWrong.png';

const imageWidth = Dimensions.get('window').width - 200;

export const SomethingWentWrong = ({onRefetch}) => {
  return (
    <View style={styles.container}>
      <Image source={SomethingWrong} style={styles.image} resizeMode={'contain'} />
      <Text style={styles.text}>Something went wrong...</Text>
      {onRefetch && (
        <TouchableHighlight onPress={onRefetch} underlayColor={COLOR} style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR, fontSize: 16}}>Retry</Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  text: {
    fontWeight: 'bold',
    color: MEDIUM,
    marginVertical: 20,
  },
  autoFillBox: {
    margin: 20,
    borderRadius: 10,
  },

  autoFill: {
    backgroundColor: DARK,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
});
