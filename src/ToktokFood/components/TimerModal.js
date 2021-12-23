import React, {useState, useEffect} from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';

import {success_ic, error_ic, warning_ic, question_ic} from 'toktokfood/assets/images';

const TimerModal = (props) => {
  const {title, message} = props;
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(1800000);

  useEffect(() => {
    let timer;
    if(duration > 0){
      timer = BackgroundTimer.setInterval(() => { 
        setDuration(prev => prev - 5000)
      }, 5000);
    } else {
      setVisible(true)
    }
    return () => { BackgroundTimer.clearInterval(timer) }
  }, [duration])

  const onCloseModal = () => {
    setDuration(1800000)
    setVisible(false)
  }

  return (
    <>
      <Modal visible={visible} style={styles.modal} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
            <Image style={styles.icon} source={warning_ic} resizeMode="contain" />
            <View style={styles.messegeWrapper}>
              {title !== undefined && <Text style={styles.messageTitle}>{title}</Text>}
              {message !== undefined && <Text style={styles.messageContent}>{message}</Text>}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => onCloseModal()}>
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

export default TimerModal;
