import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, Linking} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import SuccessIMG from '../../../assets/images/Sucess.png';
import {ThrottledOpacity} from '../../../components_section';

export const SuccesCancelBookingModal = ({
  visible,
  isViaTokwa,
  cancellationState,
  chargeAmount,
  goBackAfterCancellation,
}) => {
  const getDescription = () => {
    if (chargeAmount) {
      if (cancellationState?.initiatedBy == 'CONSUMER') {
        if (isViaTokwa) {
          return (
            <Text style={styles.modalDescription}>
              Your booking has been cancelled. ka-toktok. Thank you for paying the cancellation fee of{' '}
              <Text style={styles.textHighlight}>₱50.00</Text>. Ang iyong resibo ay sinend na namin sa iyong email.
              Iwasan mo na magcancel, ka-toktok, pang toktokfood din yan!
            </Text>
          );
        } else {
          return (
            <Text style={styles.modalDescription}>
              Your booking has been cancelled. Sa next booking na namin idadagdag ang Cancellation Fee. Thank you! You
              may also read more about our{' '}
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://go.toktok.ph/terms-and-conditions?fbclid=IwAR0eg5yTuP_iszvbiIkq84kXdiy95YtzkxmHFRXZB_8TLN-TQqhJeWIkvGk',
                  )
                }
                style={{
                  color: CONSTANTS.COLOR.ORANGE,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Cancellation Policies
              </Text>
              .
            </Text>
          );
        }
      } else {
        if (isViaTokwa) {
          return (
            <Text style={styles.modalDescription}>
              Your booking has been cancelled. ka-toktok. Thank you for paying the cancellation fee of{' '}
              <Text style={styles.textHighlight}>₱50.00</Text>. Ang iyong resibo ay sinend na namin sa iyong email.
              Iwasan mo na magcancel, ka-toktok, pang toktokfood din yan!
            </Text>
          );
        } else {
          return (
            <Text style={styles.modalDescription}>
              Your booking has been cancelled. Sa next booking na namin idadagdag ang Cancellation Fee. Thank you! You
              may also read more about our Cancellation{' '}
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://go.toktok.ph/terms-and-conditions?fbclid=IwAR0eg5yTuP_iszvbiIkq84kXdiy95YtzkxmHFRXZB_8TLN-TQqhJeWIkvGk',
                  )
                }
                style={{
                  color: CONSTANTS.COLOR.ORANGE,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Cancellation Policies
              </Text>
              .
            </Text>
          );
        }
      }
    } else {
      return (
        <Text style={styles.modalDescription}>
          Your booking has been cancelled, ka-toktok, please book with us again! Give us a chance to take you there
          safely!
        </Text>
      );
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={SuccessIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Booking Cancelled</Text>
            {getDescription()}
            <ThrottledOpacity delay={500} style={styles.buttonContainer} onPress={goBackAfterCancellation}>
              <Text style={styles.buttonText}>OK</Text>
            </ThrottledOpacity>
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
