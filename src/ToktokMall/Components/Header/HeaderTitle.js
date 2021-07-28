import React from 'react';
import {View, StyleSheet, Text, Platform,Dimensions} from 'react-native';
import { COLORS } from '../../../res/constants';
import {FONT, COLOR} from '../../../res/variables'

const {width,height} = Dimensions.get("window")

export const HeaderTitle = ({label , headerRightIsSet, position, sublabel}) => {
  return (
    <View style={{...styles.box, alignItems: position == "left" ? "flex-start" : "center"}}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>
      {sublabel && <Text style={styles.sub}>
        {sublabel}
      </Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
     width:"100%"
    //  paddingRight: Platform.OS == "android" ? 66 : 0,
    //  backgroundColor: 'red'
  },
  outer: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONT.REGULAR,
  },
  inner: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
  sub: {
    fontSize: 10,
    fontFamily: FONT.REGULAR,
    color: "gray"
  }
});
