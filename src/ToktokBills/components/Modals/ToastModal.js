import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import {useThrottle} from 'src/hooks';
import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
import Modal from 'react-native-modal';
import check_icon from 'toktokbills/assets/icons/check_ic.png';

const {width} = Dimensions.get('screen');
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE, SHADOW} = CONSTANTS;

export const ToastModal = ({title, message, visible, setVisible, onPress}) => {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(prev => ({...prev, show: false}));
      }, 1000);
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      transparent={true}
      useNativeDriver={true}
      style={styles.container}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <Image source={check_icon} style={styles.checkIcon} />
          {!!title && <Text style={[styles.successText, {color: '#F6841F'}]}>{title}</Text>}
          {!!message && <Text style={styles.messageText}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.5,
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    alignItems: 'center',
  },
  successText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(20),
    color: '#F6841F',
  },
  messageText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(10),
    color: COLOR.ORANGE,
  },
  checkIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    resizeMode: 'contain',
    marginBottom: moderateScale(10),
  },
});
