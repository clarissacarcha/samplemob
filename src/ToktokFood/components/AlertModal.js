import React from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';

const messageError = (error) => {
  try {
    const {graphQLErrors, networkError} = error;

    if (networkError) {
      return 'Network error occurred. Please check your internet connection.';
    } else if (graphQLErrors.length > 0) {
      return graphQLErrors.map(({message, locations, path, code}) => {
        if (code == 'INTERNAL_SERVER_ERROR') {
        console.log(code == 'INTERNAL_SERVER_ERROR',message)
          return 'Something went wrong...'
        } else if (code == 'USER_INPUT_ERROR') {
          return message
        } else if (code == 'BAD_USER_INPUT') {
          return message
        } else if (code == 'AUTHENTICATION_ERROR') {
          // Do Nothing. Error handling should be done on the screen
        } else {
          return 'Something went wrong...'
        }
      });
    } else {
      return 'Something went wrong.'
    }
  } catch (err) {
    // console.log('ON ERROR ALERT: ', err);
  }
};

const AlertModal = (props) => {
  // type:  success | error | warning | question
  const {visible, close, buttonLabel, error} = props;

  return (
    <>
      <Modal visible={visible} style={styles.modal} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
            <Image style={styles.icon} source={require('src/assets/toktokwallet-assets/error.png')} resizeMode="contain" />
            <View style={styles.messegeWrapper}>
              <Text style={styles.messageTitle}>{messageError(error)}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={close}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
  },
  prompContentWrapper: {
    borderRadius: 14,
    alignItems: 'center',
    width: moderateScale(325),
    backgroundColor: COLORS.WHITE,
    paddingVertical: verticalScale(20),
  },
  icon: {
    width: scale(100),
    height: scale(100),
  },
  messegeWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(15),
  },
  messageTitle: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONTS.BOLD,
    paddingBottom: moderateScale(10)
  },
  messageContent: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    fontFamily: FONTS.REGULAR,
    marginTop: moderateScale(8),
    marginBottom: moderateScale(15)
  },
  buttonWrapper: {
    marginHorizontal: 10,
  },
  confirmButton: {
    width: '85%',
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#FFA700',
    borderRadius: NUMBERS.BORDER_RADIUS,
  },
  btn1Style: {
    flex: 1,
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#868686',
    borderRadius: NUMBERS.BORDER_RADIUS,
    marginRight: 20
  },
  btn2Style: {
    flex: 1,
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#FFA700',
    borderRadius: NUMBERS.BORDER_RADIUS,
  },
  cancelButton: {},
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
  },
});

export default AlertModal;

