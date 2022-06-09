import React from 'react';
import {Text, StyleSheet, Image, View, Modal} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import Warning from '../../../../assets/images/warning.png';
import {ThrottledOpacity} from '../../../../components_section';

export const OutstandingFeeModal = ({viewOutstandingFeeModal, outstandingFee, closeOutstandingFeeModal}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={viewOutstandingFeeModal} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={Warning} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Outstanding Fee</Text>
            <Text style={styles.modalDescription}>
              Please settle {outstandingFee?.initiatedBy == 'DRIVER' ? 'No Show Fee' : 'Cancellation Fee'} to proceed
              with the booking.
            </Text>
            <ThrottledOpacity delay={500} style={styles.buttonContainer} onPress={closeOutstandingFeeModal}>
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
});
