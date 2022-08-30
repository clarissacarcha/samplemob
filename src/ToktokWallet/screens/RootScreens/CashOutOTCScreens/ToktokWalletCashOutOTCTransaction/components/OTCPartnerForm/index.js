import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {useSelector} from 'react-redux';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//COMPONENTS
import {VerifyContext} from '../VerifyContextProvider';

// COLORS AND FONTS
import CONSTANTS from 'common/res/constants';
import {MobileNumberInput, CustomTextInput, CustomAmountInput} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

export const OTCPartnerForm = ({route}) => {
  const {cashOutProviderFee, maximumAmount} = route.params.otcPartnerDetails;

  const {firstName, middleName, lastName, mobileNumber} = useSelector(state => state.session.user.person);
  const recipientName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
  const recipientMobileNo = mobileNumber.replace('+63', '');

  const {
    amount,
    setAmount,
    email,
    setEmail,
    emailError,
    setEmailError,
    amountError,
    setAmountError,
    setIsInsufficientBalance,
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
    if (!checkFormat) {
      return;
    }
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 7) {
      return;
    }
    if (num[0] === '.') {
      return setAmount('0.');
    }
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
            returnKeyType="done"
            editable={false}
          />
        </View>
        <View style={[{marginBottom: moderateScale(20)}]}>
          <MobileNumberInput label="Recipient Mobile Number" value={recipientMobileNo} editable={false} />
        </View>
        <View style={[{marginBottom: moderateScale(20)}]}>
          <CustomTextInput
            label="Email Address"
            onChangeText={changeEmail}
            value={email}
            returnKeyType="done"
            errorMessage={emailError}
          />
        </View>
        <View style={{marginBottom: moderateScale(20)}}>
          <CustomAmountInput
            label={'Enter Amount'}
            errorMessage={amountError}
            value={amount}
            onChangeText={changeAmount}
          />
          <Text style={{fontSize: FONT_SIZE.S, marginTop: 5}}>
            Additional service fee will be charge for this transaction.
          </Text>
        </View>
        <View>
          <CustomTextInput
            label="Purpose (optional)"
            value={purpose}
            maxLength={120}
            onChangeText={value => setPurpose(value)}
            textAlignVertical="top"
            numberOfLines={4}
            multiline={true}
          />
        </View>
      </View>
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
    color: '#ED3A19',
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
