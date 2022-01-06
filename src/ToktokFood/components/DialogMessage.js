import React from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity, Platform} from 'react-native';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';

import {success_ic, error_ic, warning_ic, question_ic} from 'toktokfood/assets/images';

const DialogMessage = (props) => {
  // type:  success | error | warning | question
  const {
    visibility,
    type,
    title,
    messages,
    onAccept,
    onCancel,
    onCloseModal,
    hasChildren,
    children,
    hasTwoButtons,
    btn1Title,
    btn2Title,
    onCloseBtn1,
    onCloseBtn2,
    reasons,
    btnTitle = 'OK',
  } = props;

  const getDialogIcon = () => {
    switch (type) {
      case 'success':
        return success_ic;
      case 'error':
        return error_ic;
      case 'warning':
        return warning_ic;
      case 'question':
        return question_ic;
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <Modal visible={visibility} style={styles.modal} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
            <Image style={styles.icon} source={getDialogIcon()} resizeMode="contain" />
            <View style={styles.messegeWrapper}>
              {!hasChildren && (
                <>
                  {title !== undefined && <Text style={styles.messageTitle}>{title}</Text>}
                  {messages !== undefined && <Text style={styles.messageContent}>{messages}</Text>}
                  {reasons !== undefined && <Text style={styles.reasonsContent}>{capitalizeFirstLetter(reasons)}</Text>}
                </>
              )}
              {children}
            </View>
            {hasTwoButtons ? (
              <View style={{flexDirection: 'row', marginHorizontal: moderateScale(25), marginBottom: 10}}>
                <TouchableOpacity
                  style={[reasons !== undefined ? styles.btnReasons : styles.btn1Style]}
                  onPress={() => onCloseBtn1()}>
                  <Text style={[styles.buttonText, {color: reasons !== undefined ? '#FFA700' : '#fff'}]}>
                    {btn1Title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn2Style} onPress={() => onCloseBtn2()}>
                  <Text style={styles.buttonText}>{btn2Title}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.confirmButton} onPress={() => onCloseModal()}>
                <Text style={styles.buttonText}>{btnTitle}</Text>
              </TouchableOpacity>
            )}
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
  },
  messageContent: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    fontFamily: FONTS.REGULAR,
    marginTop: moderateScale(8),
    marginBottom: moderateScale(15),
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
    marginRight: moderateScale(20),
  },
  btn2Style: {
    flex: 1,
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#FFA700',
    borderRadius: NUMBERS.BORDER_RADIUS,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
    textAlign: 'center',
  },
  btnReasons: {
    flex: 1,
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    borderColor: '#FFA700',
    borderWidth: 1,
    borderRadius: NUMBERS.BORDER_RADIUS,
    marginRight: moderateScale(20),
    paddingBottom: Platform.OS == 'android' ? moderateScale(5) : 0,
  },
  reasonsContent: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    fontFamily: FONTS.BOLD,
    marginTop: moderateScale(8),
    marginBottom: Platform.OS == 'ios' ? moderateScale(15) : 0,
    color: '#FFA700',
  },
});

export default DialogMessage;
