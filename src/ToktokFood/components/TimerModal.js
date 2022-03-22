/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

// Fonts & Colors & Images
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';
import {success_ic, error_ic, warning_ic, question_ic} from 'toktokfood/assets/images';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';

const TimerModal = props => {
  const {title, message, estimatedDeliveryTime, onCallBack, orderStatus} = props;
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(1800000);
  const timer = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      BackgroundTimer.clearInterval(timer.current);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (estimatedDeliveryTime) {
      timer.current = BackgroundTimer.setInterval(() => {
        checkTimeReached();
      }, 30000);
    } else {
      if (duration > 0) {
        timer.current = BackgroundTimer.setInterval(() => {
          setDuration(prev => prev - 5000);
        }, 5000);
      } else {
        setVisible(true);
      }
    }
    return () => {
      BackgroundTimer.clearInterval(timer.current);
    };
  }, [duration, estimatedDeliveryTime]);

  const checkTimeReached = () => {
    let edt = moment(estimatedDeliveryTime, 'h:mm a');
    console.log(estimatedDeliveryTime);
    if (moment().isAfter(edt)) {
      BackgroundTimer.clearInterval(timer.current);
      setVisible(true);
    }
  };

  const onCloseModal = () => {
    setVisible(false);
    onCallBack();
  };

  const checkMessage = () => {
    switch (orderStatus) {
      case 'po':
        return 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.';
      case 'rp':
        return 'Aw. Seems like there is no rider yet. Please wait until we get you a rider!';
      case 'f':
        return "Sorry. Looks like your rider is stucked in traffic. Let's give him few minutes to arrive.";
    }
  };

  const checkTitle = () => {
    switch (orderStatus) {
      case 'po':
        return 'Still Preparing Order';
      case 'rp':
        return 'Cannot Find Rider';
      case 'f':
        return 'Rider in Traffic';
    }
  };

  return (
    <>
      <Modal visible={visible} style={styles.modal} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
            <Image style={styles.icon} source={warning_ic} resizeMode="contain" />
            <View style={styles.messegeWrapper}>
              <Text style={styles.messageTitle}>{checkTitle()}</Text>
              <Text style={styles.messageContent}>{checkMessage()}</Text>
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
    marginRight: 20,
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
