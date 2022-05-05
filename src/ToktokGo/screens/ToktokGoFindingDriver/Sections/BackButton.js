import React from 'react';
import {TouchableOpacity, StyleSheet, StatusBar, Image} from 'react-native';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left-icon.png';
import CONSTANTS from '../../../../common/res/constants';

export const BackButton = ({navigation, popTo}) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
      <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    zIndex: 999,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
  },
});
