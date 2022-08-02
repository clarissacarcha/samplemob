import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions} from 'react-native';
import {COLOR, DARK, FONT, FONT_SIZE} from 'src/res/variables';
import LottieView from 'lottie-react-native';
import {moderateScale} from 'toktokbills/helper';

const loading = require('src/assets/animations/loading.json');

export const AlertOverlay = ({ visible, label="Processing" }) => {
  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        useNativeDriver={true}
        style={styles.container}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}>
        <View style={styles.modalBody}>
          <View style={styles.content}>
            <LottieView source={loading} autoPlay loop style={styles.loading} resizeMode="cover" />
            <Text style={styles.processing}>{label}</Text>
          </View>
        </View>
      </Modal>
    </>
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
    alignItems: 'center',
  },
  processing: {
    color: COLOR.ORANGE,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    paddingBottom: moderateScale(20),
  },
  loading: {
    height: undefined,
    width: moderateScale(170),
    aspectRatio: 1.5,
  },
});
