import React from 'react';
import {View,StyleSheet } from 'react-native';

//UTIL
import {moderateScale } from 'toktokwallet/helper';

//COMPONENTS
import {OrangeButton } from 'toktokwallet/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT_SIZE} from 'src/res/variables';

export const ConfirmButton = ({}) => {

  return (
    <>
      <View style={styles.buttonContainer}>
        <OrangeButton label="Confirm" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLOR.WHITE,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  footerText: {
    fontSize: FONT_SIZE.S,
  },
});