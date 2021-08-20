import React from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';

import {success_ic, error_ic, warning_ic, question_ic} from 'toktokfood/assets/images';

const DialogMessage = (props) => {
  // type:  success | error | warning | question
  const {visibility, type, title, messages, onAccept, onCancel, onCloseModal} = props;
  return (
    <>
      <Modal visible={visibility} style={styles.modal} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
            <Image style={styles.icon} source={error_ic} resizeMode="contain" />
            <View style={styles.messegeWrapper}>
              {title !== undefined && <Text style={styles.messageTitle}>{title}</Text>}
              {messages !== undefined && <Text style={styles.messageContent}>{messages}</Text>}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.confirmButton} onPress={() => onCloseModal()}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
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
    display: 'flex',
    borderRadius: 14,
    alignItems: 'center',
    width: moderateScale(325),
    backgroundColor: COLORS.WHITE,
    paddingVertical: verticalScale(20),
  },
  icon: {
    width: 148,
    height: 148,
  },
  messegeWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(15),
  },
  messageTitle: {
    fontSize: 24,
    color: '#F46058',
    fontFamily: FONTS.BOLD,
  },
  messageContent: {
    textAlign: 'center',
    color: COLORS.MEDIUM,
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.REGULAR,
    marginTop: moderateScale(8),
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    display: 'flex',
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: scale(22),
    backgroundColor: COLORS.ORANGE,
    borderRadius: NUMBERS.BORDER_RADIUS,
  },
  cancelButton: {},
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONTS.BOLD,
  },
});

export default DialogMessage;
