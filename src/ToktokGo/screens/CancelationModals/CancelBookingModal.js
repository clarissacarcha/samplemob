import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import WarningIMG from '../../../assets/images/warning.png';
import {ThrottledOpacity} from '../../../components_section';

export const CancelBookingModal = ({isVisible, setVisible, setViewCancelReasonModal}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={WarningIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalSubTitle}>Cancellation Fee: ₱50.00</Text>
            <Text style={styles.modalDescription}>
              You are cancelling <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD}}>5 minutes</Text> after
              getting a driver. Cancellation Fee will be charged on you to compensate the driver. Are you sure you want
              to cancel?
            </Text>

            <View style={styles.retryContainer}>
              <ThrottledOpacity
                delay={500}
                style={styles.cancelButtonContainer}
                onPress={() => {
                  setVisible(false);
                }}>
                <Text style={styles.textStyle}>No</Text>
              </ThrottledOpacity>

              <ThrottledOpacity
                delay={500}
                style={styles.retryButtonContainer}
                underlayColor={CONSTANTS.COLOR.LIGHT}
                onPress={() => {
                  setVisible(false), setViewCancelReasonModal(true);
                }}>
                <Text style={styles.cancelTextStyle}>Yes</Text>
              </ThrottledOpacity>
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    marginVertical: 20,
  },
  modalSubTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 8,
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
