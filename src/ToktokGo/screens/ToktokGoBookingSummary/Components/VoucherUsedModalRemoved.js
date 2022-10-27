import React from 'react';
import {Text, StyleSheet, Image, View, Modal, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import SuccessIMG from '../../../../assets/images/success_claimed.png';

const FULL_WIDTH = Dimensions.get('window').width;

export const VoucherUsedModalRemoved = ({isVissible}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVissible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={SuccessIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Voucher Removed</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    width: FULL_WIDTH * 0.4,
  },
  modalTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginTop: 16,
    marginBottom: 36,
  },
  imageDimensions: {
    marginTop: 31,
    width: 80,
    height: 80,
  },
});
