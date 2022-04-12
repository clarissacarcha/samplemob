import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, StatusBar} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import WarningIMG from '../../../common/assets/globalert/Warning.png';

export const DriverCancelled = ({onCancel, cancel, onCancelWithFee, setVisible}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={cancel} style={StyleSheet.absoluteFill}>
      <TouchableOpacity
        style={styles.displayRight}
        onPress={() => {
          onCancelWithFee();
        }}>
        <Text style={{color: 'red'}}>Cancellation Fee</Text>
      </TouchableOpacity>

      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <Image source={WarningIMG} resizeMode={'contain'} style={styles.imageDimensions} />
            <Text style={styles.modalTitle}>Driver Cancelled</Text>
            <View style={{marginHorizontal: 5}}>
              <Text style={styles.modalDescription}>Sorry but the driver can't make it to your pick-up location.</Text>
              <View style={styles.divider} />

              <View style={{marginHorizontal: -25}}>
                <Text style={{color: '#525252', fontSize: CONSTANTS.FONT_SIZE.S}}>Reason</Text>
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, marginTop: 8}}>Route is traffic</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={onCancel}>
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
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 20,
    marginHorizontal: -25,
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
