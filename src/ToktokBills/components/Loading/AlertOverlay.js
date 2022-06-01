import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {moderateScale} from 'toktokbills/helper';
import LottieView from 'lottie-react-native';
const loading = require('toktokbills/assets/animations/loading.json');

const WIDTH = Dimensions.get('window').width * 0.3;

export const AlertOverlay = ({visible}) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.transparent}>
        <View style={styles.labelRow}>
          <View style={styles.loaderBox}>
            <LottieView source={loading} autoPlay loop />
          </View>
          <Text style={styles.text}>Processing...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 105,
  },
  labelRow: {
    paddingTop: 33,
    marginTop: '125%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 10,
  },
  loaderBox: {
    width: WIDTH,
    height: WIDTH,
    borderRadius: 10,
  },
  text: {
    marginBottom: moderateScale(36),
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  }
});
