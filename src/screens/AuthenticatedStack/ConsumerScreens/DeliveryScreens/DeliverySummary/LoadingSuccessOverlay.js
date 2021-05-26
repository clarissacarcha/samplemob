/**
 * An overlay used to display successful booking
 */
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {DARK, MEDIUM, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {useNavigation} from '@react-navigation/native';

const imageWidth = Dimensions.get('window').width - 80;
const cardSize = Dimensions.get('window').width - 120;

import BookingSuccessCheck from '../../../../../assets/toktok/images/BookingSuccess.png';

const Loader = () => (
  <View style={styles.labelRow}>
    <View style={styles.labelBox}>
      <Text style={{color: DARK}}>Processing...</Text>
    </View>
    <View style={styles.loaderBox}>
      <ActivityIndicator color={COLOR.YELLOW} />
    </View>
  </View>
);

const BookingSuccess = ({onPress}) => (
  // <View style={{height: '100%', backgroundColor: 'white', borderRadius: 10}}>
  //   <View style={{flex: 1, margin: 20, justifyContent: 'center', alignItems: 'center'}}>
  //     <Image source={OrderBooked} style={{height: imageWidth, width: imageWidth}} resizeMode={'contain'} />
  //     <Text style={{fontFamily: FONT_REGULAR, color: MEDIUM, marginTop: 20}}>Your order has been booked.</Text>
  //   </View>

  //   <TouchableHighlight underlayColor={COLOR} style={styles.submitBox}>
  //     <View style={styles.submit}>
  //       <Text style={{color: COLOR, fontSize: 14, fontFamily: FONT_MEDIUM}}>OK</Text>
  //     </View>
  //   </TouchableHighlight>
  // </View>
  <View
    style={{
      height: cardSize - 70,
      padding: 10,
      width: cardSize,
      backgroundColor: 'white',
      marginBottom: 200,
      borderRadius: 5,
      alignItems: 'center',
    }}>
    <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Image source={BookingSuccessCheck} resizeMode={'contain'} />
    </View>
    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Booked Successfully</Text>
    <TouchableOpacity onPress={onPress} style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: COLOR.ORANGE, fontFamily: FONT.BOLD}}>Continue</Text>
    </TouchableOpacity>
  </View>
);

export default ({visible, done = false, onOkay}) => {
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
    marginHorizontal: 60,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    height: '60%',
  },
  labelBox: {
    flex: 1,
    backgroundColor: COLOR.YELLOW,
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
    backgroundColor: COLOR.BLACK,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    margin: 10,
    borderRadius: 5,
  },
  submit: {
    backgroundColor: COLOR.BLACK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
