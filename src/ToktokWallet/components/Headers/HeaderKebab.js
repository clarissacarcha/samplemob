import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';

// FONTS, ICONS, COLORS AND IMAGES
import {VectorIcon, ICON_SET} from 'src/revamp';

//HELPER
const {COLOR, FONT_FAMILY: FONT} = CONSTANTS;

export const HeaderKebab = ({onPress, color = '#F6841F', refNo, format}) => {
  return (
    <TouchableOpacity onPress={''} style={styles.backContainer}>
      <VectorIcon color={COLOR.ORANGE} size={21} iconSet={ICON_SET.Entypo} name="dots-three-vertical" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
