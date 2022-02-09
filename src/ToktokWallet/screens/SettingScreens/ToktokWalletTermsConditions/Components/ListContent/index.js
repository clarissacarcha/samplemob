import React , {useRef} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from "common/res/constants";
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

export const ListContent = (props) => {
  const {contents, subContent, buttetType} = props;

  return (
    <View style={styles.sectionWrapper}>
      <Text style={styles.sectionTitle}>{contents.title}</Text>
      <Text style={styles.sectionText}>{contents.content}</Text>
      {typeof contents.listContent !== 'undefined' &&
        contents.listContent.map((v) => {
          return (
            <View style={styles.listTextContent}>
              <Text style={[styles.sectionText]}>
                { !!v.title && <Text style={styles.sectionTitle}>{v.title}</Text> }
                <Text>{v.content}</Text>
              </Text>
                { typeof v.subContent !== 'undefined' && (
                  <View style={{ paddingTop: moderateScale(20) }}>
                    {
                      v.subContent.map((subVal) => (
                        <View style={[{ flexDirection: 'row' }, styles.sectionText, styles.subContentText]}>
                          <Text>{subVal.title} </Text>
                          <Text>{subVal.content}</Text>
                        </View>
                      ))
                    }
                  </View>
                )}
            </View>
          )
        })}
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
  listTextContent: {
    marginBottom: moderateScale(15),
  },
  subContentText: {
    marginLeft: moderateScale(20),
  }
});

