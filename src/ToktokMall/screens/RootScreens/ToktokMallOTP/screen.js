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
import { connect, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../graphql';
import { POST_VERIFY_TOKTOKWALLET_PIN } from '../../../../graphql/toktokmall/virtual';

import {OTP, TPIN, ValidatorMaxRequest} from './Components'
import { TPINOTPContext } from './ContextProvider';
import AsyncStorage from '@react-native-community/async-storage';

const Component = ({navigation, route, otpAttempts, setAttempts}) => {

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
    AsyncStorage.getItem("ToktokMallOTPAttempts").then((raw) => Context.setretries(raw))

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

      let errordata = JSON.parse(req.responseError.message)
      if(errordata.errors[0]){
        let payload = errordata.errors[0].payload
        if(payload.remainingAttempts){
          Context.setretries(payload.remainingAttempts)
        }
      }

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

  const resendPin = async () => {
    let transactionPayload = await BuildTransactionPayload({
      method: "TOKTOKWALLET", 
      notes: "", 
      total: route?.params.grandTotal, 
      toktokid: session.user.id,
      // toktokid: 1,
      transactionTypeId: "TOKTOKWALLET PAYMENT"
    })

    if(req.responseData && req.responseData.success == 1){

      const checkoutBody = await BuildPostCheckoutBody({
        walletRequest: req.responseData.data,
        pin: "",
        items: route.params?.data?.paramsData, 
        addressData: route.params?.data?.addressData, 
        subTotal: route.params?.data?.subTotal,
        grandTotal: route.params?.data?.grandTotal, 
        srpTotal: route.params?.data?.srpTotal,
        vouchers: route.params?.data?.voucher, 
        shippingVouchers: route.params?.data?.shippingVouchers,
        shippingRates: route.params?.data?.shippingFeeRates,
        paymentMethod: "TOKTOKWALLET",
        hashAmount: req.responseData.hash_amount,
        referenceNum: req.responseData.orderRefNum
      })

      Toast.show("New pin is available")
    }else{
      Toast.show("Something went wrong")
    }
  }

  return (
    <>
      <LoadingOverlay label="Verifying" isVisible={validating}/>
      <LoadingOverlay label="Processing" isVisible={processing} />
      {/* <AlertModal
        // navigation = {navigation}
        isVisible = {true}
        // setIsVisible = {setAlertModal}
      /> */}

      {route.params?.error && route.params?.errorCode == "VALIDATORMAXREQUEST" &&
        <ValidatorMaxRequest />
      }

      {route.params?.data?.pin_type == "OTP" && 
        <OTP 
          onValidate={ValidatePin}     
          onReset={resendPin}      
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


const mapStateToProps = (state) => ({
  otpAttempts: state.toktokMall.otpAttempts
})

const mapDispatchToProps = (dispatch) => ({
  setAttempts: (action, payload) => dispatch({type: 'TOKTOK_MALL_OTP_ATTEMPTS', action,  payload}),
});

export const ToktokMallOTPScreen = connect(mapStateToProps, mapDispatchToProps)(Component);
