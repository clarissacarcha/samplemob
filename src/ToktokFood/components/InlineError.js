import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const InlineError = props => {
  const {
    isError = false,
    isInlineError = false,
    isVisible = false,
    setIsVisible,
    inlineMessage = 'Voucher has been fully redeemed.',
    message = 'Order is eligible for shipping voucher promo. Voucher is automatically applied.',
  } = props;
  const containerStyle = isError ? styles.errorContainer : styles.successContainer;
  const textStyle = isError ? styles.errorText : styles.successText;
  const icon = isError ? 'times-circle' : 'check-circle';
  const iconColor = isError ? '#F6841F' : '#06A44E';
  const inlineError = isError ? inlineMessage : 'Voucher successfully applied!';

  if (isVisible) {
    if (isInlineError) {
      return (
        <Animatable.View animation="fadeOut" delay={1000} duration={3000} onAnimationEnd={() => setIsVisible(false)}>
          <View style={styles.voucherContainer}>
            <Text style={textStyle}>{inlineError}</Text>
          </View>
        </Animatable.View>
      );
    }

    return (
      <Animatable.View animation="fadeOut" delay={1000} duration={4000} onAnimationEnd={() => setIsVisible(false)}>
        <View style={containerStyle}>
          <FIcon5 name={icon} size={17} color={iconColor} />
          <Text style={textStyle}>{message}</Text>
        </View>
      </Animatable.View>
    );
  }
  return null;
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
  voucherContainer: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(10),
  },
});
