import React, {useState, useReducer, useEffect} from 'react';
import TextTicker from 'react-native-text-ticker';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

import {useKeyboard} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';

import {DELETE_SHOP_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';

import {CHECK_HAS_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import DialogMessage from 'toktokfood/components/DialogMessage';
import Loader from 'toktokfood/components/Loader';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

import {clearShopHistory} from 'toktokfood/helper/persistentHistory';
import AddressBookModal from './AddressBookModal';

// const PickUpDetails = ({pinAddress, onConfirm, isCart}) => {

const PickUpDetails = ({pinAddress, onConfirm, isCart}) => {
  const alert = useAlert();

  const navigation = useNavigation();
  const keyboardHeight = useKeyboard();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showInvalidMobile, setShowInvalidMobile] = useState(false);
  const [showInvalidContactName, setShowInvalidContactName] = useState(false);

  const {receiver, customerInfo} = useSelector(state => state.toktokFood);

  const initialState = {
    landmark: '',
    contactPerson: '',
    contactPersonNumber: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LANDMARK':
        return {...state, landmark: action.value};
      case 'SET_CONTACT_NAME':
        return {...state, contactPerson: action.value};
      case 'SET_CONTACT_NUMBER':
        return {...state, contactPersonNumber: action.value};
    }
  };

  const initState = () => (Object.keys(receiver).length > 0 ? receiver : initialState);
  const [state, dispatch] = useReducer(reducer, initialState, initState);

  const [checkHasTemporaryCart, {data: temporaryCart}] = useLazyQuery(CHECK_HAS_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: err => {
      Alert.alert('', 'Something went wrong.');
    },
  });

  const [deleteShopTemporaryCart, {loading}] = useMutation(DELETE_SHOP_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    variables: {
      input: {
        userid: customerInfo.userId,
        shopid: temporaryCart?.checkHasTemporaryCart?.shopid,
        branchid: 0,
      },
    },
    onError: error => {
      onErrorAlert({alert, error});
    },
    onCompleted: ({deleteShopTemporaryCart}) => {
      onConfirm(state);
      setShowSuccess(true);
    },
  });

  const proceedChangeAddress = () => {
    if (temporaryCart?.checkHasTemporaryCart?.shopid !== 0) {
      deleteShopTemporaryCart();
    } else {
      setShowSuccess(true);
      onConfirm(state);
    }
    clearShopHistory();
  };

  const validateContactName = () => {
    const name = state.contactPerson;
    if (name.length === 0) {
      setShowInvalidContactName(true);
    } else {
      proceedChangeAddress();
    }
  };

  const onConfirmAddress = () => {
    const mobileNumber = state.contactPersonNumber.replace(/\s/g, '').replace(/[()]/g, '');
    if (mobileNumber.length !== 0) {
      if (mobileNumber.length !== 10 || mobileNumber[0] !== '9') {
        setShowInvalidMobile(true);
      } else {
        validateContactName();
      }
    } else {
      validateContactName();
    }
  };

  const onContactSelected = (contact = {name: '', number: ''}) => {
    dispatch({type: 'SET_CONTACT_NAME', value: contact.name});
    dispatch({type: 'SET_CONTACT_NUMBER', value: contact.number});
  };

  useEffect(() => {
    checkHasTemporaryCart({variables: {input: {userId: customerInfo.userId}}});
  }, []);

  return (
    <>
      <AddressBookModal
        visibility={showContacts}
        onSelected={v => onContactSelected(v)}
        onClose={() => setShowContacts(false)}
      />
      <Loader visibility={loading} message="Saving" hasImage={false} loadingIndicator />
      <DialogMessage
        visibility={showSuccess}
        title="Change Location"
        messages="You have successfully changed your location"
        type="success"
        btn1Title="OK"
        onCloseModal={() => {
          setShowSuccess(false);
          isCart ? navigation.navigate('ToktokFoodHome') : navigation.pop();
        }}
      />
      <DialogMessage
        visibility={showInvalidMobile}
        title="Invalid Mobile Number"
        messages="Kindly provide valid mobile number"
        type="warning"
        btn1Title="OK"
        onCloseModal={() => {
          setShowInvalidMobile(false);
        }}
      />
      <DialogMessage
        visibility={showInvalidContactName}
        title="Invalid Contact Name"
        messages="Kindly provide valid contact name"
        type="warning"
        btn1Title="OK"
        onCloseModal={() => {
          setShowInvalidContactName(false);
        }}
      />
      <View style={[styles.proto, styles.cartBorder, {bottom: keyboardHeight - 35}]}>
        <View style={styles.sheet}>
          <Text style={styles.pickUpAddressTitle}>Drop-off Address Details</Text>
          <TextTicker loop duration={10000} repeatSpacer={25} marqueeDelay={1000} style={styles.pickUpAddress}>
            {pinAddress + '.'}
          </TextTicker>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Landmark"
              value={state.landmark}
              onChangeText={value => dispatch({type: 'SET_LANDMARK', value})}
            />
          </View>
          <View style={[styles.inputWrapper, styles.customInputWrapper]}>
            <TextInput
              style={[styles.input, {width: '72%'}]}
              placeholder="Contact Person"
              value={state.contactPerson}
              onChangeText={value => dispatch({type: 'SET_CONTACT_NAME', value})}
            />
            <TouchableOpacity style={styles.addressBookButton} onPress={() => setShowContacts(true)}>
              <Text style={styles.addressBookText}>Address Book</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputWrapper, {flexDirection: 'row'}]}>
            <View style={styles.countryCodeWrapper}>
              <Text style={styles.countryCodeText}>+63</Text>
            </View>
            <TextInput
              maxLength={10}
              style={[styles.input, {height: 57, flex: 1}]}
              keyboardType="number-pad"
              placeholder="Contact Person's Number"
              value={state.contactPersonNumber}
              onChangeText={value => dispatch({type: 'SET_CONTACT_NUMBER', value})}
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
    fontSize: FONT_SIZE.L,
    fontWeight: '500',
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
    marginTop: verticalScale(18),
  },
  buttonText: {
    color: COLOR.WHITE,
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
    color: COLOR.BLACK,
  },
  addressBookButton: {
    height: 29,
    borderWidth: 1,
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderColor: COLOR.YELLOW,
  },
  addressBookText: {
    fontSize: 12,
    color: COLOR.YELLOW,
    fontFamily: FONT.REGULAR,
  },
  customInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryCodeWrapper: {
    height: '100%',
    marginRight: 5,
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
  },
  countryCodeText: {
    fontSize: 14,
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
});
export default PickUpDetails;
