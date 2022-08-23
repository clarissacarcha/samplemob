import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import SucessIMG from '../../../../assets/images/Sucess.png';
import WalletIcon from '../../../../assets/images/Wallet.png';

export const PaymentSuccesModal = ({viewPaymenetSucessModal, setViewPaymenetSucessModal}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={viewPaymenetSucessModal} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={SucessIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Payment On Hold</Text>
            <Text style={styles.modalDescription}>
              <Text style={styles.textHighlight}>₱380.00</Text> is currently on hold. You'll be charged the fare amount
              once the service is fulfilled.
            </Text>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => setViewPaymenetSucessModal(false)}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
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
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  modalTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    marginVertical: 20,
  },
  modalDescription: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
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
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
});
