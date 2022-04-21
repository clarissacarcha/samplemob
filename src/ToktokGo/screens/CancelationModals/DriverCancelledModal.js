import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import WarningIMG from '../../../assets/images/warning.png';
import TokWaIMG from '../../../assets/images/wallet-whiteOutline.png';
import TokGoWhiteIMG from '../../../assets/images/tokGo-whiteOutline.png';
import TokGoIMG from '../../../assets/images/tokGo.png';
import {numberFormat} from '../../../helper';

export const DriverCancelledModal = ({driverVisible, setType, setVisible, setDriverVisible, cancellationState}) => {
  const submit = () => {
    setType(2);
    setVisible(true);
    setDriverVisible(false);
  };
  return (
    <Modal animationType="fade" transparent={true} visible={driverVisible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={WarningIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Driver Cancelled</Text>
            <Text style={styles.modalSubTitle}>No Show Fee: ₱{numberFormat(cancellationState?.chargeAmount)}</Text>
            <Text style={styles.modalDescription}>
              Driver cancelled your booking after waiting for more than{' '}
              <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD}}>5 minutes</Text> at the pick up location. You will
              be charged{' '}
              <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD, color: CONSTANTS.COLOR.ORANGE}}>
                ₱{numberFormat(cancellationState?.chargeAmount)}
              </Text>{' '}
              to compensate the driver. Would you like to pay now?
            </Text>
            {true && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  submit();
                }}>
                <Image source={TokGoWhiteIMG} style={styles.buttonImg} resizeMode={'contain'} />
                <Text style={styles.buttonText}>Pay in Next Booking</Text>
              </TouchableOpacity>
            )}
            {false && (
              <>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
                  <Image source={TokWaIMG} style={styles.buttonImg} resizeMode={'contain'} />
                  <Text style={styles.buttonText}>Pay via toktokwallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whiteButtonContainer} onPress={() => {}}>
                  <Image source={TokGoIMG} style={styles.buttonImg} resizeMode={'contain'} />
                  <Text style={styles.whiteButtonText}>Pay in Next Booking</Text>
                </TouchableOpacity>
              </>
            )}
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  whiteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
  whiteButtonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.ORANGE,
  },
  modalSubTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 8,
  },
  buttonImg: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
