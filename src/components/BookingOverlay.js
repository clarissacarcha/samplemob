/**
 * An overlay used to display successful booking
 */
import React from 'react';
import {View, Text, Modal, StyleSheet, ActivityIndicator, TouchableHighlight, Image, Dimensions} from 'react-native';
import {COLOR, DARK, MEDIUM} from '../res/constants';

const imageWidth = Dimensions.get('window').width - 80;

import OrderBooked from '../assets/images/OrderBooked.png';

const Loader = () => (
  <View style={styles.labelRow}>
    <View style={styles.labelBox}>
      <Text style={{color: DARK}}>Processing...</Text>
    </View>
    <View style={styles.loaderBox}>
      <ActivityIndicator color={COLOR} />
    </View>
  </View>
);

const BookingSuccess = ({onPress}) => (
  <View style={{height: '100%', backgroundColor: 'white', borderRadius: 10}}>
    <View style={{flex: 1, margin: 20, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={OrderBooked} style={{height: imageWidth, width: imageWidth}} resizeMode={'contain'} />
      <Text style={{fontFamily: 'Rubik-Medium', color: MEDIUM, marginTop: 20}}>Your order has been booked.</Text>
    </View>

    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.submitBox}>
      <View style={styles.submit}>
        <Text style={{color: COLOR, fontSize: 20}}>OK</Text>
      </View>
    </TouchableHighlight>
  </View>
);

export const BookingOverlay = ({visible, done = false, onOkay}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.transparent}>
        <View style={styles.cardBox}>
          {!done && <Loader />}
          {done && <BookingSuccess onPress={onOkay} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
  },
  labelRow: {
    marginBottom: 20,
    height: 40,
    flexDirection: 'row',
  },
  cardBox: {
    marginHorizontal: 20,
    height: '70%',
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    height: '60%',
  },
  labelBox: {
    flex: 1,
    backgroundColor: COLOR,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  loaderBox: {
    marginLeft: 20,
    width: 40,
    height: 40,
    backgroundColor: DARK,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
