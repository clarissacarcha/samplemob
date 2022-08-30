import React , {useRef} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from "common/res/constants";
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

export const SectionContent = (props) => {
  const {contents} = props;
  return (
    <View style={styles.sectionWrapper}>
      { !!contents.title && <Text style={styles.sectionTitle}>{contents.title}</Text> }
      <Text style={styles.sectionText}>{contents.content}</Text>
    </View>
  ); 
};

const styles = StyleSheet.create({
  sectionWrapper: {
    width: '100%',
    marginBottom: moderateScale(20),
  },
  sectionTitle: {
    marginBottom: 8,
    fontFamily: FONT.BOLD,
  },
  sectionText: {
    textAlign: 'justify',
  },
});

