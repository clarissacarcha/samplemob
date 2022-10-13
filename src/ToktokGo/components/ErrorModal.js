import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import SucessIMG from '../../assets/images/Sucess.png';
import WalletIcon from '../../assets/images/Wallet.png';
import Warning from '../../assets/images/warning.png';
import normalize from 'react-native-normalize';

export const ErrorModal = ({visible, close, message, title}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={Warning} resizeMode={'contain'} style={styles.imageDimensions} />
            {title && <Text style={styles.modalTitle}>{title}</Text>}
            <View style={{marginTop: title == undefined ? 20 : 0, width: normalize(200)}}>
              <Text style={styles.modalDescription}>{message}</Text>
            </View>
            <TouchableOpacity style={styles.buttonContainerYes} onPress={close}>
              <Text style={styles.buttonTextYes}>OK</Text>
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
    fontSize: normalize(20),
    marginVertical: 15,
  },
  modalDescription: {
    textAlign: 'center',
    fontSize: normalize(14),
    color: CONSTANTS.COLOR.BLACK,
    fontWeight: '400',
  },
  imageDimensions: {
    width: normalize(135),
    height: normalize(120),
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
    width: normalize(284),
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonTextNo: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.ORANGE,
  },
  buttonTextYes: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: normalize(15),
    color: CONSTANTS.COLOR.WHITE,
  },
});
