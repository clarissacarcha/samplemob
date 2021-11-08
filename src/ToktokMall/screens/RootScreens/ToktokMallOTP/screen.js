import React, {useState, useEffect, useRef, useContext} from 'react';
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

import {OTP, TPIN} from './Components'
import { TPINOTPContext } from './ContextProvider';

export const ToktokMallOTPScreen =  ({navigation, route}) => {

  const session = useSelector(state => state.session)
	const Context = useContext(TPINOTPContext)
	const [validating, setValidating] = useState(false)
	const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if(route?.params.error && route.params.errorCode == "VALIDATORMAXREQUEST"){
      Context.setIsInvalid(true)
      Context.setretries(5)
      Context.setlockMessage(route?.params.lockMessage)
    }
  }, [route])

  const ValidatePin = async () => {

    let transactionType = route.params?.transaction || null
    let body = {
      request_money_id: route.params?.data?.request_id,
      pin_type: route.params?.data?.pin_type,
      pin: Context.value
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
      Context.setValue("")
      Context.setIsInvalid(true)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  const ProcessPayment = async () => {

    let checkoutBody = route.params.data
    checkoutBody.pin = Context.value

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

  return (
    <>
      <LoadingOverlay label="Verifying" isVisible={validating}/>
      <LoadingOverlay label="Processing" isVisible={processing} />
      
      {route.params?.data?.pin_type == "OTP" && 
        <OTP 
          onValidate={ValidatePin}           
        />
      }
      {route.params?.data?.pin_type == "TPIN" && 
        <TPIN 
          onValidate={ValidatePin}           
        />
      }

    </>
  )
  
}
// );
