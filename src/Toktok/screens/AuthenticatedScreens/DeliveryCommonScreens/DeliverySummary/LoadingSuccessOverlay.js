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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={BookingSuccessCheck}
        resizeMode={'contain'}
        style={{width: cardSize - 185, height: cardSize - 185}}
      />
    </View>
    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L, height: 25}}>Booked Successfully</Text>
    <TouchableOpacity onPress={onPress} style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
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
