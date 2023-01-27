import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from 'toktokbills/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
const {COLOR} = CONSTANTS;
import {throttle} from 'lodash';
import {download_icon} from 'toktokload/assets/icons';

export const HeaderRight = ({onPress, isFavorite = false, isDownload = false}) => {
  const onPressThrottle = throttle(
    () => {
      onPress();
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableOpacity style={[styles.header]} onPress={onPressThrottle}>
      {isDownload ? (
        <Image source={download_icon} style={styles.downloadIcon} />
      ) : (
        <FIcon5 name={isFavorite ? 'heart' : 'heart-o'} color={COLOR.ORANGE} size={moderateScale(17)} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingRight: moderateScale(16),
  },
  downloadIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
});
