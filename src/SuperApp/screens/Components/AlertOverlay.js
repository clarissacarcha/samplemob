import React from 'react';
import {View, Text, Modal, StyleSheet, Dimensions} from 'react-native';
// import {COLOR, DARK, FONT, FONT_SIZE} from 'src/res/variables';
import CONSTANTS from '../../../common/res/constants';
import LottieView from 'lottie-react-native';
import Loading from '../../../assets/JSON/loading.json';

const width = Dimensions.get('window').width;

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
          <LottieView source={Loading} autoPlay loop style={styles.loading} />
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
    width: width * 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  processing: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginTop: 10,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  loading: {
    height: 80,
    width: 80,
  },
});
