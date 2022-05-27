import React, {useContext, useRef} from 'react';
import {View, Text, Dimensions, StyleSheet, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import validator from 'validator';

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
import {InputAmount} from 'toktokbills/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

const processErrorMessage = (fieldValue, fieldName, fieldWidth, fieldType, minWidth) => {
  // 0 = min | 1 = exact | 2 = max
  if (fieldValue.length < minWidth) {
    return `${fieldName} must be minimum of ${minWidth} characters.`;
  }
  switch (fieldType) {
    case 0:
      return fieldValue.length < fieldWidth ? `${fieldName} must be minimum of ${fieldWidth} characters.` : '';
    case 1:
      return fieldValue.length < fieldWidth ? `${fieldName} must be ${fieldWidth} characters in length.` : '';
    case 2:
      return fieldValue.length > fieldWidth ? `${fieldName} length must be ${fieldWidth} characters or less.` : '';

    default:
      return '';
  }
};

const processFieldValue = (fieldValue, fieldWidth, fieldType) => {
  // 0 = min | 1 = exact | 2 = max
  return fieldType != 0 ? maxLengthRegex(fieldValue, fieldWidth) : fieldValue;
};

export const PaymentForm = ({billItemSettings}) => {
  const {
    firstFieldName,
    firstFieldFormat,
    firstFieldWidth,
    firstFieldWidthType,
    firstFieldMinWidth,
    secondFieldName,
    secondFieldFormat,
    secondFieldWidth,
    secondFieldWidthType,
    secondFieldMinWidth,
    commissionRateDetails,
  } = billItemSettings;

  //CONVENIENCE FEE
  const convenienceFee = `${numberFormat(parseFloat(commissionRateDetails?.providerServiceFee))}`;
  const toktokSeviceFee = `${numberFormat(parseFloat(commissionRateDetails?.systemServiceFee))}`;

  const convenienceFeeText =
    convenienceFee > 0 || toktokSeviceFee > 0
      ? `Additional ${currencyCode}${convenienceFee} convenience fee and ${currencyCode}${toktokSeviceFee} toktok service fee will be charged in this transaction.`
      : 'Convenience fee is waived for this transaction';

  const navigation = useNavigation();
  const {
    firstField,
    setFirstField,
    firstFieldError,
    setFirstFieldError,
    secondField,
    setSecondField,
    secondFieldError,
    setSecondFieldError,
    amount,
    setAmount,
    email,
    setEmail,
    emailError,
    setEmailError,
    amountError,
    setAmountError,
    setIsInsufficientBalance,
  } = useContext(VerifyContext);

  const changeFirstField = value => {
    setFirstFieldError('');
    const fieldFormatValue = firstFieldFormat === 1 ? numericRegex(value) : alphanumericRegex(value);
    const fieldValue = processFieldValue(fieldFormatValue, firstFieldWidth, firstFieldWidthType);
    setFirstField(fieldValue);
  };

  const changeSecondField = value => {
    setSecondFieldError('');
    const fieldFormatValue = secondFieldFormat === 1 ? numericRegex(value) : alphanumericRegex(value);
    const fieldValue = processFieldValue(fieldFormatValue, secondFieldWidth, secondFieldWidthType);
    setSecondField(fieldValue);
  };

  const changeEmail = value => {
    setEmailError('');
    setEmail(value);
  };

  const changeAmount = value => {
    setIsInsufficientBalance(false);
    setAmountError('');
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) return;
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 6) return;
    if (num[0] == '.') return setAmount('0.');
    setAmount(num);
  };

  return (
    <View style={styles.searchField}>
      <View style={[{marginBottom: moderateScale(20)}]}>
        <Text style={styles.label}>{firstFieldName}</Text>
        <TextInput
          style={[styles.input, !!firstFieldError && styles.errorBorder]}
          // placeholder={`Enter ${firstFieldName.toLowerCase()}`}
          onChangeText={changeFirstField}
          value={firstField}
          keyboardType={firstFieldFormat == 1 ? 'numeric' : 'default'}
          maxLength={firstFieldWidthType == 1 || firstFieldWidthType == 2 ? firstFieldWidth : null}
          returnKeyType="done"
        />
        {!!firstFieldError && <Text style={styles.error}>{firstFieldError}</Text>}
      </View>
      <View style={[{marginBottom: moderateScale(20)}]}>
        <Text style={styles.label}>{secondFieldName}</Text>
        <TextInput
          style={[styles.input, !!secondFieldError && styles.errorBorder]}
          // placeholder={`Enter ${secondFieldName.toLowerCase()}`}
          onChangeText={changeSecondField}
          value={secondField}
          keyboardType={secondFieldFormat == 1 ? 'numeric' : 'default'}
          maxLength={secondFieldWidthType == 1 || secondFieldWidthType == 2 ? secondFieldWidth : null}
          returnKeyType="done"
        />
        {!!secondFieldError && <Text style={styles.error}>{secondFieldError}</Text>}
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
      <View>
        <Text style={styles.label}>Payment Amount</Text>
        <InputAmount errorMessage={amountError} amount={amount} changeAmount={changeAmount} />
        {!!amountError && <Text style={styles.error}>{amountError}</Text>}
        <Text style={{fontSize: FONT_SIZE.S, marginTop: 5}}>{convenienceFeeText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchField: {
    backgroundColor: 'white',
    margin: moderateScale(16),
  },
  input: {
    paddingHorizontal: moderateScale(15),
    height: SIZE.FORM_HEIGHT,
    fontSize: FONT_SIZE.M,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    fontFamily: FONT.REGULAR,
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
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(5),
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
});
