import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import SucessIMG from '../../../../assets/images/Sucess.png';
import WalletIcon from '../../../../assets/images/Wallet.png';
import Warning from '../../../../assets/images/warning.png';
import normalize from 'react-native-normalize';

export const VoucherRemovedModal = ({
  voucherRemovedVisible,
  setvoucherRemovedVisible,
  handleVoucherRemoved,
  voucherTextMessage,
  onProceedToBooking,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={voucherRemovedVisible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={Warning} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Voucher Removed</Text>
            {voucherTextMessage == 'Promo Voucher Expired.' ? (
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalDescription}>
                  Sorry ka-toktok, pero ang voucher ay expired na.Meron pa kaming ibang voucher for you, Check mo na!
                  Would you like to proceed and remove the voucher?
                </Text>
              </View>
            ) : voucherTextMessage == 'Daily limit is reached.' ? (
              <Text style={styles.modalDescription}>
                Hello, ka-toktok! The voucher reached the maximum redemption limit. You may try other voucher naman
                lods! Would you like to proceed and remove the voucher?
              </Text>
            ) : voucherTextMessage == 'WrongPaymentMethod' ? (
              <Text style={styles.modalDescription}>
                Pasensya ka na, ka-toktok, but the voucher you used is not applicable to your selected payment method.
                Gusto mo ba tanggalin or magswitch nalang ng payment method?
              </Text>
            ) : null}
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.buttonContainerNo} onPress={() => setvoucherRemovedVisible(false)}>
                <Text style={styles.buttonTextNo}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainerYes} onPress={() => onProceedToBooking()}>
                <Text style={styles.buttonTextYes}>Yes</Text>
              </TouchableOpacity>
            </View>
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
    padding: 25,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  modalTitleContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalTitle: {
    color: '#FDBA1C',
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    marginVertical: 20,
  },
  modalDescription: {
    textAlign: 'center',
    fontSize: normalize(CONSTANTS.FONT_SIZE.M + 1),
    color: CONSTANTS.COLOR.BLACK,
  },
  imageDimensions: {
    width: 135,
    height: 120,
  },
  textHighlight: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  buttonContainerNo: {
    marginTop: 20,
    width: '44%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonContainerYes: {
    marginTop: 20,
    width: '44%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    marginLeft: 30,
  },
  buttonTextNo: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.ORANGE,
  },
  buttonTextYes: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
});
