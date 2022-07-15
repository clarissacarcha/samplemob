import React, {useContext, useRef, useState} from 'react';
import {View, Text, Dimensions, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import validator from 'validator';
import {useSelector} from 'react-redux';

//HELPER
import {
  moderateScale,
  formatAmount,
  numberFormat,
  numericRegex,
  alphanumericRegex,
  maxLengthRegex,
  minLengthRegex,
  currencyCode,
} from 'toktokbills/helper';

//COMPONENTS
import {VerifyContext} from '../VerifyContextProvider';

// COLORS AND FONTS
import CONSTANTS from 'common/res/constants';
import {InputAmount, DateModal} from 'toktokwallet/components';
import {calendar_icon} from 'toktokwallet/assets';
import moment from 'moment';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const OTCPartnerForm = ({route}) => {
  const {cashOutProviderFee, toktokServiceFee, maximumAmount} = route.params.otcPartnerDetails;

  const {firstName, middleName, lastName, mobileNumber} = useSelector(state => state.session.user.person);
  const recipientName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
  const recipientMobileNo = mobileNumber.replace('+63', '0');

  const [showDateModal, setShowDateModal] = useState(false);

  const navigation = useNavigation();
  const {
    firstField,
    setFirstField,
    secondField,
    setSecondField,
    amount,
    setAmount,
    email,
    setEmail,
    emailError,
    setEmailError,
    amountError,
    setAmountError,
    setIsInsufficientBalance,
    dateOfClaim,
    setDateOfClaim,
    setDateOfClaimError,
    dateOfClaimError,
    purpose,
    setPurpose,
    setProviderServiceFee,
    setToktokServiceFee,
  } = useContext(VerifyContext);

  const changeEmail = value => {
    setEmailError('');
    setEmail(value);
  };

  const checkProviderServiceFee = value => {
    if (parseFloat(value) > 0 && parseFloat(value) <= parseFloat(maximumAmount)) {
      let providerFee = cashOutProviderFee.filter(item => {
        return parseFloat(value) >= parseFloat(item.amountFrom) && parseFloat(value) <= parseFloat(item.amountTo);
      });

      if (providerFee.length > 0) {
        const {amountFee, percentageFee, toktokServiceFee} = providerFee[0];
        console.log(providerFee[0]);
        const providerServiceFee = parseFloat(amountFee) + parseFloat(value) * (parseFloat(percentageFee) / 100);
        setProviderServiceFee(providerServiceFee);
        setToktokServiceFee(toktokServiceFee);
      } else {
        setFeesToZero();
      }
    } else {
      setFeesToZero();
    }
  };

  const setFeesToZero = () => {
    setProviderServiceFee(0);
    setToktokServiceFee(0);
  };

  const changeAmount = value => {
    checkProviderServiceFee(value);
    setIsInsufficientBalance(false);
    setAmountError('');
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) return;
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 7) return;
    if (num[0] == '.') return setAmount('0.');
    setAmount(num);
  };

  return (
    <>
      <View style={styles.searchField}>
        <View style={[{marginBottom: moderateScale(20)}]}>
          <Text style={styles.label}>Recipient Name</Text>
          <TextInput
            style={[styles.input]}
            value={recipientName}
            keyboardType={'default'}
            maxLength={30}
            returnKeyType="done"
            editable={false}
          />
        </View>
        <View style={[{marginBottom: moderateScale(20)}]}>
          <Text style={styles.label}>Recipient Mobile Number</Text>
          <TextInput
            style={[styles.input]}
            value={recipientMobileNo}
            keyboardType={'numeric'}
            maxLength={11}
            returnKeyType="done"
            editable={false}
          />
        </View>
        <View style={[{marginBottom: moderateScale(20)}]}>
          <Text style={styles.label}>Email Address (optional)</Text>
          <TextInput
            style={[styles.input, !!emailError && styles.errorBorder]}
            onChangeText={changeEmail}
            value={email}
            returnKeyType="done"
          />
          {!!emailError && <Text style={styles.error}>{emailError}</Text>}
        </View>
        {/* <View style={[{marginBottom: moderateScale(20)}]}>
          <Text style={styles.label}>Date of Claim</Text>
          <TouchableOpacity
            onPress={() => setShowDateModal(true)}
            style={[
              styles.input,
              {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
              !!dateOfClaimError && styles.errorBorder,
            ]}>
            {dateOfClaim == '' ? (
              <Text style={{flex: 1, fontFamily: FONT.REGULAR, color: COLOR.DARK, fontSize: FONT_SIZE.M}}>
                mm/dd/yy
              </Text>
            ) : (
              <Text style={{flex: 1, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
                {moment(dateOfClaim).format('MM/DD/YYYY')}
              </Text>
            )}
            <Image source={calendar_icon} style={{width: moderateScale(20), height: moderateScale(20)}} />
          </TouchableOpacity>
          {!!dateOfClaimError && <Text style={styles.error}>{dateOfClaimError}</Text>}
        </View> */}
        <View style={{marginBottom: moderateScale(20)}}>
          <Text style={styles.label}>Enter Amount</Text>
          <InputAmount errorMessage={amountError} amount={amount} changeAmount={changeAmount} />
          {!!amountError && <Text style={styles.error}>{amountError}</Text>}
          <Text style={{fontSize: FONT_SIZE.S, marginTop: 5}}>
            Additional service fee will be charge for this transaction.
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Purpose (optional)</Text>
          <TextInput
            style={[styles.inputPurpose]}
            value={purpose}
            maxLength={120}
            onChangeText={value => setPurpose(value)}
            placeholderTextColor={COLOR.DARK}
            textAlignVertical="top"
            numberOfLines={4}
            multiline={true}
          />
        </View>
      </View>
      {/* <DateModal
        visible={showDateModal}
        setVisible={setShowDateModal}
        value={dateOfClaim}
        isCurrentDate={true}
        minDate={new Date()}
        maxDate={new Date(moment().add(7, 'days'))}
        onDateChange={date => {
          setDateOfClaim(date);
          setDateOfClaimError('');
        }}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  searchField: {
    backgroundColor: 'white',
    margin: moderateScale(16),
  },
  inputContainer: {
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
  },
  input: {
    paddingHorizontal: moderateScale(15),
    height: SIZE.FORM_HEIGHT,
    fontSize: FONT_SIZE.M,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    fontFamily: FONT.REGULAR,
    flex: 1,
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(40),
    alignSelf: 'center',
    tintColor: '#F6841F',
  },
  error: {
    fontSize: FONT_SIZE.S,
    marginTop: 5,
    color: COLOR.RED,
  },
  label: {
    fontSize: FONT_SIZE.S,
    marginBottom: moderateScale(5),
    fontFamily: FONT.BOLD,
    color: '#525252',
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  inputPurpose: {
    height: moderateScale(90),
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    borderColor: COLOR.MEDIUM,
    marginTop: moderateScale(5),
    textAlignVertical: 'top',
    marginVertical: moderateScale(6),
    paddingTop: 15,
    paddingHorizontal: moderateScale(15),
  },
});
