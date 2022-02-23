import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const InlineError = props => {
  const {isError = false, message = 'Order is eligible for shipping voucher promo. Voucher is automatically applied.'} =
    props;
  const containerStyle = isError ? styles.errorContainer : styles.successContainer;
  const textStyle = isError ? styles.errorText : styles.successText;
  const icon = isError ? 'times-circle' : 'check-circle';
  const iconColor = isError ? '#F6841F' : '#06A44E';

  return (
    <View style={containerStyle}>
      <FIcon5 name={icon} size={17} color={iconColor} />
      <Text style={textStyle}>{message}</Text>
    </View>
  );
};

export default InlineError;

const styles = StyleSheet.create({
  successContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 164, 78, 0.2)',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  successText: {
    color: '#06A44E',
    marginLeft: 10,
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFCF4',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  errorText: {
    color: '#F6841F',
    marginLeft: 10,
  },
});
