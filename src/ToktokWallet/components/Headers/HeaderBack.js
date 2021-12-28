import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

export const HeaderBack = ({ navigation })=> {
  
  const backAction = () => {
    navigation.pop()
  };

  return (
    <TouchableHighlight onPress={backAction} underlayColor={'white'} style={styles.button}>
      <View style={styles.iconBox}>
        <FIcon5 name="chevron-left" color={COLOR.YELLOW} size={13}/>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginLeft: 10,
    overflow: 'hidden',
    height: 30,
    width: 30,
  },
  iconBox: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
