import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderNote = ({label, title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.note}>{title}</Text>
      <Text numberOfLines={1} style={styles.notes}>
        {label}
      </Text>
    </View>
  );
};

export default OrderNote;

const styles = StyleSheet.create({
  note: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  notes: {
    fontWeight: '300',
    fontSize: FONT_SIZE.M,
    marginTop: verticalScale(5),
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
  },
});
