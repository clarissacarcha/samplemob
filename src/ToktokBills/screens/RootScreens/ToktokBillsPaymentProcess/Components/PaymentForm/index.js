import React, { useContext, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import validator from 'validator'

//HELPER
import {
  moderateScale,
  formatAmount,
  numberFormat,
  numericRegex,
  alphanumericRegex,
  maxLengthRegex,
  minLengthRegex
} from 'toktokbills/helper'

//COMPONENTS
import { VerifyContext } from "../VerifyContextProvider";

// COLORS AND FONTS
import CONSTANTS from 'common/res/constants';

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW, SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

const processErrorMessage = (fieldValue, fieldName, fieldWidth, fieldType) => {
  // 0 = min | 1 = exact | 2 = max 
  switch(fieldType){
    case 0:
      return fieldValue.length < fieldWidth ? `${fieldName} must be at least ${fieldWidth} characters in length` : "";
    case 1:
      return fieldValue.length < fieldWidth ? `${fieldName} must be ${fieldWidth} characters in length` : "";
    case 2:
      return fieldValue.length > fieldWidth ? `${fieldName} length must be ${fieldWidth} characters or less` : "";
  
    default:
      return "";
  }
}

const processFieldValue = (fieldValue, fieldWidth, fieldType) => {
  // 0 = min | 1 = exact | 2 = max 
  return fieldType != 0 ? maxLengthRegex(fieldValue, fieldWidth) : fieldValue;
}

export const PaymentForm = ({ billItemSettings })=> {

  const {
    firstFieldName,
    firstFieldFormat,
    firstFieldWidth,
    firstFieldWidthType,
    secondFieldName,
    secondFieldFormat,
    secondFieldWidth,
    secondFieldWidthType,
    commissionRateDetails
  } = billItemSettings;
  
  //CONVENIENCE FEE
  const convenienceFee = parseFloat(commissionRateDetails?.providerServiceFee) + parseFloat(commissionRateDetails?.systemServiceFee); 
 
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
    setAmountError
  } = useContext(VerifyContext);
  const accountNameRef = useRef(null);
  const amountRef = useRef(null);
  const emailRef = useRef(null);
  
  const changeFirstField = (value)=> {
    const fieldFormatValue = firstFieldFormat === 1 ? numericRegex(value) : alphanumericRegex(value);
    const fieldValue = processFieldValue(fieldFormatValue, firstFieldWidth, firstFieldWidthType) 
    setFirstField(fieldValue);
    
    //error
    const errorMessage = processErrorMessage(fieldValue, firstFieldName, firstFieldWidth, firstFieldWidthType);
    fieldValue ? setFirstFieldError(errorMessage) : setFirstFieldError(`${firstFieldName} is required.`)
  }

  const changeSecondField = (value) => {
    const fieldFormatValue = secondFieldFormat === 1 ? numericRegex(value) : alphanumericRegex(value);
    const fieldValue = processFieldValue(fieldFormatValue, secondFieldWidth, secondFieldWidthType) 
    setSecondField(fieldValue);

    //error
    const errorMessage = processErrorMessage(fieldValue, secondFieldName, secondFieldWidth, secondFieldWidthType);
    fieldValue ? setSecondFieldError(errorMessage) : setSecondFieldError(`${secondFieldName} is required.`)
  }

  const changeEmail = (value) => {
    if(value != "" && !validator.isEmail(value, {ignore_whitespace: true})){
      setEmailError("Email format is invalid.")
    } else {
      setEmailError("")
    }
    setEmail(value)
  }

  const changeAmount = (value) => {
    let pattern = /^\d+(\.\d{2})?$/;
    if(value[0] == "0"){
      value.replace(0, "");
      return setAmount(value.replace(0, ""));
    }
   
    value ? setAmountError(!pattern.test(value) ? "Amount format is invalid." : "")
      : setAmountError(`Payment amount is required.`)
    formatAmount(value, setAmount)
  }

  return (
    <View style={styles.searchField}>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder={firstFieldName}
          onChangeText={changeFirstField}
          value={firstField}
          keyboardType={firstFieldFormat == 1 ? "numeric" : "default"}
          maxLength={firstFieldWidthType == 1 || firstFieldWidthType == 2 ? firstFieldWidth : null}
          returnKeyType="next"
          onSubmitEditing={() => { accountNameRef.current.focus(); }}
          blurOnSubmit={false}
        />
        { !!firstFieldError && <Text style={styles.error}>{firstFieldError}</Text>}
      </View>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder={secondFieldName}
          onChangeText={changeSecondField}
          value={secondField}
          keyboardType={secondFieldFormat == 1 ? "numeric" : "default"}
          maxLength={secondFieldWidthType == 1 || secondFieldWidthType == 2 ? secondFieldWidth : null}
          returnKeyType="next"
          ref={(input) => { accountNameRef.current = input; }}
          onSubmitEditing={() => { amountRef.current.focus(); }}
          blurOnSubmit={false}
        />
        { !!secondFieldError && <Text style={styles.error}>{secondFieldError}</Text>}
      </View>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder="Enter payment amount"
          onChangeText={changeAmount}
          value={amount}
          keyboardType="numeric"
          returnKeyType="next"
          ref={(input) => { amountRef.current = input; }}
          onSubmitEditing={() => { emailRef.current.focus(); }}
          blurOnSubmit={false}
        />
        { !!amountError && <Text style={styles.error}>{amountError}</Text>}
        <Text style={{ fontSize: FONT_SIZE.S, marginTop: 5 }}>
          {`Additional ₱ ${numberFormat(convenienceFee)} convenience fee will be charged in this transaction`}
          </Text>
      </View>
      <View>
        <TextInput 
          style={styles.input}
          placeholder="Enter email address (optional)"
          onChangeText={changeEmail}
          value={email}
          ref={(input) => { emailRef.current = input; }}
          returnKeyType="done"
        />
        { !!emailError && <Text style={styles.error}>{emailError}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchField: {
    backgroundColor:"white",
    margin: moderateScale(16),
  },
  input: {
    paddingHorizontal: moderateScale(15),
    height: SIZE.FORM_HEIGHT,
    fontSize: FONT_SIZE.M,
    borderRadius: 5,
    backgroundColor:"#F7F7FA",
    fontFamily: FONT.REGULAR,
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(40),
    alignSelf: "center",
    tintColor: "#F6841F"
  },
  error: {
    fontSize: FONT_SIZE.S,
    marginTop: 5,
    color: COLOR.RED
  }
})