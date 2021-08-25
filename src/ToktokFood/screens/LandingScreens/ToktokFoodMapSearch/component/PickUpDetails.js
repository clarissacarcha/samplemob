import React from 'react';
import TextTicker from 'react-native-text-ticker';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

import {useKeyboard} from 'toktokfood/hooks';

const PickUpDetails = (props) => {
  const {pinAddress} = props;

  const navigation = useNavigation();
  const keyboardHeight = useKeyboard();

  return (
    <>
      <View style={[styles.proto, styles.cartBorder, {bottom: keyboardHeight - 35}]}>
        <View style={styles.sheet}>
          <Text style={styles.pickUpAddressTitle}>Pickup Address Details</Text>
          <TextTicker loop duration={10000} repeatSpacer={25} marqueeDelay={1000} style={styles.pickUpAddress}>
            {pinAddress + '.'}
          </TextTicker>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Your Complete Address"
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Contact Person"
            />
          </View>
          <View style={[styles.inputWrapper, {marginBottom: 8}]}>
            <TextInput
              style={styles.input}
              //   onChangeText={(value) => changePersonInfo('firstName', value)}
              placeholder="Contact Person's Number"
            />
          </View>

          <TouchableOpacity onPress={() => navigation.pop()} style={styles.cartButton}>
            <Text style={styles.buttonText}>Confirm Address Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  proto: {
    height: '53%',
    width: '101%',
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  cartBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
  },
  sheet: {
    padding: 15,
  },
  pickUpAddressTitle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
    marginBottom: verticalScale(7),
  },
  pickUpAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  cartButton: {
    width: '100%',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    marginTop: verticalScale(5),
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.MEDIUM,
  },
  input: {
    height: 50,
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
});
export default PickUpDetails;
