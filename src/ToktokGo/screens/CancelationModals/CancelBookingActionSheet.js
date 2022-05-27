import React, {useState} from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import tokGoIMG from '../../../assets/images/tokGo.png';
import tokWaIMG from '../../../assets/images/Wallet.png';
import {ThrottledOpacity} from '../../../components_section';

export const CancelBookingActionSheet = ({setVisible}) => {
  const [selectedPayment, setSelectedPayment] = useState();
  const [data, setData] = useState([
    {
      label: 'Passenger no show',
      img: tokGoIMG,
      value: '0',
    },
    {
      label: 'Passenger rude',
      img: tokWaIMG,
      value: '1',
    },
  ]);

  return (
    <ActionSheet id="cancel_booking" overlayColor="none">
      <View style={styles.container}>
        <View style={{}}>
          <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD, color: CONSTANTS.COLOR.ALMOST_BLACK}}>
            Reason for Cancellation
          </Text>
          <Text style={{color: CONSTANTS.COLOR.ALMOST_BLACK}}>data here</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.BOLD, marginBottom: 16, color: CONSTANTS.COLOR.ALMOST_BLACK}}>
            Select Payment
          </Text>

          <View opacity={true ? 0.5 : 1}>
            <ThrottledOpacity
              delay={500}
              disabled={true}
              onPress={() => {
                setSelectedPayment(1);
              }}
              style={styles.radioButtonContainer}>
              <View style={styles.radioButton}>
                <View style={1 == selectedPayment ? styles.radioButtonIcon : styles.radioButtonIcon1} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image source={tokWaIMG} style={styles.imageDimensions} resizeMode={'contain'} />
                <Text style={styles.radioButtonText}>
                  Pay via toktok<Text style={{color: CONSTANTS.COLOR.ORANGE}}>wallet</Text>
                </Text>
              </View>
            </ThrottledOpacity>
          </View>
          <View style={styles.radioDivider} />
          <TouchableOpacity
            onPress={() => {
              setSelectedPayment(2);
            }}
            style={styles.radioButtonContainer}>
            <View style={styles.radioButton}>
              <View style={2 == selectedPayment ? styles.radioButtonIcon : styles.radioButtonIcon1} />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image source={tokGoIMG} style={styles.imageDimensions} resizeMode={'contain'} />
              <Text style={styles.radioButtonText}>Pay in Next Booking</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.paymentContainer}>
          <Text style={styles.textStyles}>Total</Text>
          <Text style={styles.textStyles}>₱50.00</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            SheetManager.hide('cancel_booking'), setVisible(true);
          }}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', height: 10, backgroundColor: 'white', position: 'absolute', bottom: 0}} />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    right: 4,
    width: '102%',
    borderWidth: 3,
    borderTopColor: CONSTANTS.COLOR.ORANGE,
    borderLeftColor: CONSTANTS.COLOR.ORANGE,
    borderRightColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 21,
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column',
  },
  radioButton1: {
    height: 16,
    width: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#F9B71A',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 16,
    width: 16,
    marginRight: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F9B71A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  radioDivider: {
    borderBottomWidth: 3,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 18,
  },
  radioButtonText: {
    marginLeft: 8,
    color: CONSTANTS.COLOR.YELLOW,
  },
  imageDimensions: {
    width: 24,
    height: 24,
  },
  paymentContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textStyles: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.L,
    color: CONSTANTS.COLOR.ORANGE,
  },
  buttonContainer: {
    marginTop: 24,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
