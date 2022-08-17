import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions} from 'react-native';
// import {COLOR, DARK, FONT, FONT_SIZE} from 'src/res/variables';
import CONSTANTS from '../../../common/res/constants';
import LottieView from 'lottie-react-native';
import Loading from '../../../assets/JSON/loading.json';

const WIDTH = Dimensions.get('window').width * 0.3;

export const AlertOverlay = ({visible}) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.transparent}>
        <View style={styles.labelRow}>
          <View style={styles.loaderBox}>
            <LottieView source={Loading} autoPlay loop />
          </View>
          <Text style={styles.textDesign}>Processing</Text>
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
    alignItems: 'center',
    marginTop: '125%',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
  },
  loaderBox: {
    width: WIDTH, // size of the loader
    height: WIDTH, // size of the loader
    borderRadius: 10,
    alignItems: 'center',
  },
  textDesign: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginTop: 22,
    paddingBottom: 37,
  },
});
