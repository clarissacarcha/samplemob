import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const NotFinishRequirement = ({notFinishLabel, btnLabel, onPress, disabled, imgSource, headerTitle, notFinishComponent }) => {
  return (
    <View style={[styles.cardShadow, styles.cardStyle]}>
      <View style={styles.cardHeader}>
          <Image source={imgSource} style={styles.img} />
          <Text style={[styles.fontBoldStyle,{marginLeft: 15}]}>{headerTitle}</Text>
      </View>
      {
        notFinishComponent
        ? notFinishComponent()
        : <Text style={[styles.fontRegularStyle]}>{notFinishLabel}</Text>
      }
      <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
        <Text style={[styles.btnLabel]}>{btnLabel}</Text>
      </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  fontRegularStyle: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    marginTop: 10,
    // paddingLeft: 15,
    // flex: 1,
  },
  fontBoldStyle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  btnLabel: {
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  cardShadow: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardStyle: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection:"row",
    alignItems: "center"
  },  
  buttonStyle: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
    marginTop: 10,
    alignSelf:"flex-end"
  },
  img: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
});
