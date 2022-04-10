import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, StatusBar} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import WarningIMG from '../../../assets/images/warning.png';

export const CancelBookingNoFeeModal = ({isVisible, setVisible, setNextModal, setDriverVisivle}) => {
  const cancel = () => {
    setVisible(!isVisible);
    setNextModal(true);
  };
  const driverFee = () => {
    setVisible(false);
    setDriverVisivle(true);
  };
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <TouchableOpacity
          style={styles.displayRight}
          onPress={() => {
            driverFee();
          }}>
          <Text style={{color: 'red'}}>Cancellation Fee</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={WarningIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalDescription}>Are you sure you want to cancel this booking?</Text>

            <View style={styles.retryContainer}>
              <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => setVisible(!isVisible)}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.retryButtonContainer} onPress={() => cancel()}>
                <Text style={styles.cancelTextStyle}>Yes</Text>
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
    color: CONSTANTS.COLOR.YELLOW,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
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
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
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
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
  retryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
    marginRight: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  retryButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  cancelTextStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
  displayRight: {
    zIndex: 999,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    right: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
