import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import SucessIMG from '../../../../assets/images/Sucess.png';
import WalletIcon from '../../../../assets/images/Wallet.png';
import Warning from '../../../../assets/images/warning.png';

export const NotEnoughBalanceModal = ({visible, setVisible, navigation}) => {
  const navigateToWallet = () => {
    setVisible(false);
    navigation.push('ToktokWalletLoginPage');
  };
  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={Warning} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Not Enough Balance</Text>
            <Text style={styles.modalDescription}>
              You do not have enough balance to proceed with this payment. Would you like to cash in?
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.buttonContainerNo}
                onPress={() => {
                  setVisible(false);
                }}>
                <Text style={styles.buttonTextNo}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonContainerYes}
                onPress={() => {
                  navigateToWallet();
                }}>
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
