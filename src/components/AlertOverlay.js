import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions} from 'react-native';
import {COLOR, DARK, FONT, FONT_SIZE} from 'src/res/variables';
import LottieView from 'lottie-react-native';
import {moderateScale} from 'toktokbills/helper';

const loading = require('src/assets/animations/loading.json');

export const AlertOverlay = ({visible}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      useNativeDriver={true}
      style={styles.container}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <LottieView source={loading} autoPlay loop style={styles.loading} />
          <Text style={styles.processing}>Processing</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(20),
    alignItems: 'center',
    paddingHorizontal: moderateScale(35),
  },
  processing: {
    color: COLOR.ORANGE,
    fontFamily: FONT.BOLD,
    marginTop: moderateScale(10),
    fontSize: FONT_SIZE.M,
  },
  loading: {
    height: moderateScale(80),
    width: moderateScale(80),
  },
});
