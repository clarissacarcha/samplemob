import React, { useContext, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import validator from 'validator'

//HELPER
import { moderateScale, formatAmount, numberFormat } from 'toktokbills/helper'

//COMPONENTS
import { VerifyContext } from "../VerifyContextProvider";

// COLORS AND FONTS
import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW, SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

export const PaymentForm = ({})=> {

  const navigation = useNavigation();
  const {
    accountNo,
    setAccountNo,
    accountName,
    setAccountName,
    amount,
    setAmount,
    email,
    setEmail,
    emailError,
    setEmailError,
    accountNoError,
    setAccountNoError,
    amountError,
    setAmountError
  } = useContext(VerifyContext);
  const accountNameRef = useRef(null);
  const amountRef = useRef(null);
  const emailRef = useRef(null);

  const changeAccountNumber = (value)=> {
    const num = value.replace(/[^0-9]/g, '')
    setAccountNo(num)
    setAccountNoError(value.length < 11 ? "Account Number maximum length must be 11" : "")
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
    setAmountError(!pattern.test(value) ? "Amount format is invalid." : "")
    formatAmount(value, setAmount)
  }

  return (
    <View style={styles.searchField}>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder="Enter 11-digit account number"
          onChangeText={changeAccountNumber}
          value={accountNo}
          keyboardType="decimal-pad"
          maxLength={11}
          returnKeyType="next"
          onSubmitEditing={() => { accountNameRef.current.focus(); }}
          blurOnSubmit={false}
        />
        { !!accountNoError && <Text style={styles.error}>{accountNoError}</Text>}
      </View>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder="Enter account name"
          onChangeText={(val) => setAccountName(val)}
          value={accountName}
          returnKeyType="next"
          ref={(input) => { accountNameRef.current = input; }}
          onSubmitEditing={() => { amountRef.current.focus(); }}
          blurOnSubmit={false}
        />
      </View>
      <View style={[{ marginBottom: moderateScale(30) }]}>
        <TextInput 
          style={styles.input}
          placeholder="Enter payment amount"
          onChangeText={changeAmount}
          value={amount}
          keyboardType="decimal-pad"
          pattern={ "^\d+(\.\d{2})?$"}
          onValidation={isValid => console.log(isValid, "dfsd")}
          returnKeyType="next"
          ref={(input) => { amountRef.current = input; }}
          onSubmitEditing={() => { emailRef.current.focus(); }}
          blurOnSubmit={false}
        />
        { !!amountError && <Text style={styles.error}>{amountError}</Text>}
        <Text style={{ fontSize: FONT_SIZE.S, marginTop: 5 }}>Additional ₱ 100.00 convenience fee will be charged in this transaction</Text>
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
    margin: moderateScale(16), flex: 1
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