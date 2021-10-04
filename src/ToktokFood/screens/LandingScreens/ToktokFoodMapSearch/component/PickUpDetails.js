import React, {useReducer} from 'react';
import TextTicker from 'react-native-text-ticker';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {useKeyboard} from 'toktokfood/hooks';

const PickUpDetails = (props) => {
  const initialState = {completeAddress: '', contactPerson: '', contactPersonNumber: ''};

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_COMPLETE_ADDRESS':
        return {...state, completeAddress: action.value};
      case 'SET_CONTACT_NAME':
        return {...state, contactPerson: action.value};
      case 'SET_CONTACT_NUMBER':
        return {...state, contactPersonNumber: action.value};
    }
  }

  const {pinAddress} = props;
  const navigation = useNavigation();
  const keyboardHeight = useKeyboard();
  const dispatchToStore = useDispatch();
  const {receiver} = useSelector((state) => state.toktokFood);

  const initState = () => (Object.keys(receiver).length > 0 ? receiver : initialState);
  const [state, dispatch] = useReducer(reducer, initialState, initState);

  const onConfirmAddress = () => {
    const {contactPerson, contactPersonNumber} = state;
    if (contactPerson !== '' && contactPersonNumber !== '') {
      dispatchToStore({type: 'SET_TOKTOKFOOD_ORDER_RECEIVER', payload: state});
    }
    navigation.pop();
  };

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
              placeholder="Your Complete Address"
              value={state.completeAddress}
              onChangeText={(value) => dispatch({type: 'SET_COMPLETE_ADDRESS', value})}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contact Person"
              value={state.contactPerson}
              onChangeText={(value) => dispatch({type: 'SET_CONTACT_NAME', value})}
            />
          </View>
          <View style={[styles.inputWrapper, {marginBottom: 8}]}>
            <TextInput
              maxLength={11}
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Contact Person's Number"
              value={state.contactPersonNumber}
              onChangeText={(value) => dispatch({type: 'SET_CONTACT_NUMBER', value})}
            />
          </View>

          <TouchableOpacity onPress={() => onConfirmAddress()} style={styles.cartButton}>
            <Text style={styles.buttonText}>Confirm Address Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  proto: {
    height: 370,
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
    marginBottom: verticalScale(17),
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
    marginTop: verticalScale(10),
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
