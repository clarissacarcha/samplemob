import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput, ScrollView} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header, LoadingOverlay} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon, otpbg, otpicon2} from '../../../assets';
import CustomIcon from '../../../Components/Icons';
import Toast from "react-native-simple-toast";
import { FONT_REGULAR } from '../../../../res/constants';
import {
  ApiCall, 
  PaypandaApiCall, 
  BuildPostCheckoutBody, 
  BuildTransactionPayload, 
  WalletApiCall,
  ToktokWalletRawApiCall
} from "../../../helpers";
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../graphql';
import { POST_VERIFY_TOKTOKWALLET_PIN } from '../../../../graphql/toktokmall/virtual';

export const ToktokMallOTP =  ({navigation, route}) => {

  const session = useSelector(state => state.session)
  const inputRef = useRef(null)
  const [value, setValue] = useState("")
  const [retries, setretries] = useState(1)
  const [isInvalid, setIsInvalid] = useState(false)
  const [validating, setValidating] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [lockMessage, setlockMessage] = useState("We're sorry but you dont have any attempts left, Please wait for 30 minutes to request an OTP again. Thank you!")

  useEffect(() => {
    if(route?.params.error && route.params.errorCode == "VALIDATORMAXREQUEST"){
      setIsInvalid(true)
      setretries(5)
      setlockMessage(route?.params.lockMessage)
    }
  }, [route])

  const ValidatePin = async () => {

    let transactionType = route.params?.transaction || null
    let body = {
      request_money_id: route.params?.data?.request_id,
      pin_type: route.params?.data?.pin_type,
      pin: value
    }

    console.log(JSON.stringify(body))
    
    setProcessing(false)
    setValidating(true)
    const req = await WalletApiCall("verify_pin", body, false)
    
    setProcessing(false)
    setValidating(false)

    if(req.responseData && req.responseData.success == 1){
    setValidating(false)
      if(transactionType && transactionType == "payment"){
        await ProcessPayment()
      }
    }else if(req.responseError && req.responseError.success == 0){
      // Toast.show(req.responseError.message, Toast.LONG)
      setValue("")
      setIsInvalid(true)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  const ProcessPayment = async () => {

    let checkoutBody = route.params.data
    checkoutBody.pin = value

    console.log("Checkout body", JSON.stringify(checkoutBody))
    
    setValidating(false)
    setProcessing(true)
    const req = await ApiCall("checkout", checkoutBody, false)
    setProcessing(false)

    if(req.responseData && req.responseData.success == 1){

      route.params.onSuccess(req.responseData)
      navigation.pop()

    }else if(req.responseError){
      console.log(req.responseError)
      const regex = /(<([^>]+)>)/ig;
      Toast.show(req.responseError.message.replace(regex, ""), Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
    setProcessing(false)
  }
console.log("validating", processing, validating)

  return (
    <KeyboardAwareScrollView style={{backgroundColor: "#FFF"}}>

      <LoadingOverlay label="Verifying" isVisible={validating}/>
      <LoadingOverlay label="Processing" isVisible={processing} />

      {/* <ImageBackground 
        source={otpbg}
        style = {styles.container}
        imageStyle={{width: '100%', height: Dimensions.get("screen").height, resizeMode: 'cover'}}
      > */}
      <View style = {styles.container} >
        <View style = {{margin: 20, alignItems: 'center', height: Dimensions.get("window").height*0.7, paddingTop: Dimensions.get("window").height*0.2}}>
            <Image
              source={otpicon2}
            />     
            {
              isInvalid && retries >= 5  ? //enter condition here for checking if user has available attempts left
              <>
                <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>No Attempts Left</Text>
                <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 14, fontFamily: FONT.REGULAR}}>
                  {lockMessage}
                </Text>
              </> : 
              // else
              <>
                <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>Enter OTP</Text>
                <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 13, fontFamily: FONT.REGULAR}}>Please enter the code that we will send via SMS.</Text>
                <View style = {{flexDirection: 'row', marginTop: 25}}>
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 1 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 2 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 3 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 4 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ?1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 5 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {value.length >= 6 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                </View>
              </>
            }
            
            
        </View>

        {isInvalid && retries < 5 &&
        <View style={{alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
          <Text style={{color: '#F6841F'}}>The OTP you entered is invalid. </Text>
          <Text style={{color: '#F6841F'}}>You have {5 - retries} retries remaining.</Text>
        </View>}

        {/* { //true &&
          isInvalid && retries >= 5 && 
        <View style={{alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
          <Text style={{color: '#F6841F'}}>You have exceeded your retries to enter OTP.</Text>
        </View>} */}

        {!isInvalid && <View style={{height: 35}}/>}

        
          {/* // isInvalid && retries < 5 ? // put condition here not for invalid/expired  */}
          <View style = {{flexDirection: 'row', marginBottom: 15}}>
            <Text style = {{fontFamily: FONT.REGULAR}}>Didn't receive OTP code?</Text>
            <TouchableOpacity>
              <Text style = {{fontFamily: FONT.REGULAR, color: COLOR.ORANGE}} > Resend</Text>
            </TouchableOpacity>
          </View> 
          {/* ?: <></> */}
        
      
        {!isInvalid && <TouchableOpacity 
          activeOpacity={0.5} 
          disabled={value.length != 6} 
          onPress={async () => {

            await ValidatePin()

          }} 
          style={value && value.length == 6 ? styles.activeButton : styles.invalidButton}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>}

        {isInvalid && value == "" && retries < 5 &&

          <TouchableOpacity 
            activeOpacity={0.5} 
            onPress={async () => {
              setIsInvalid(false)  
              setretries(retries + 1)
            }} 
            style={styles.activeButton}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        }

        {isInvalid && retries >= 5 && // put condition here for 0 attempts available

          <TouchableOpacity 
            activeOpacity={1} 
            onPress={async () => {
              navigation.pop(2)
            }} 
            style={styles.activeButton}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity> 
        }
      </View>
      {/* </ImageBackground> */}

      <TextInput 
          ref={inputRef} 
          keyboardType="number-pad"
          maxLength = {6}
          style={{width: 0, height: 0}} 
          value={value}
          onChangeText={(val) => {
            setValue(val)
          }}
        />
     
    </KeyboardAwareScrollView>
  );
}
// );



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image:{
    alignSelf: 'center'
  },
  charContainer: {
    height: 60,
    width: '15%', 
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeButton: {
    // height: 45,
    paddingVertical: 15,
    width: '80%',
    borderRadius: 5,
    backgroundColor: COLOR.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invalidButton: {
    // height: 45,
    paddingVertical: 15,
    width: '80%',
    borderRadius: 5,
    backgroundColor: "#D7D7D7",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: FONT.REGULAR,
    fontSize: 14
  }
});
