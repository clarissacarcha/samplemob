import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput, ScrollView} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon, otpbg} from '../../../assets';
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

  const [validatePin, {error, loading}] = useMutation(POST_VERIFY_TOKTOKWALLET_PIN, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    onCompleted: async (response) => {
      console.log(response)
    },
    onError: (err) => console.log(err),
  });

  const ProcessPayment = async () => {

    let checkoutBody = route.params.data
    checkoutBody.pin = value
    const req = await ApiCall("checkout", checkoutBody, true)

    if(req.responseData && req.responseData.success == 1){

      route.params.onSuccess()
      navigation.pop()

    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }

  }

  useEffect(() => {
    console.log(value)
  }, [value])

  useEffect(() => {
    console.log(route.params.data)
  }, [])

  return (
    <KeyboardAwareScrollView style={{backgroundColor: "#FFF"}}>
      <ImageBackground 
        source={otpbg}
        style = {styles.container}
        imageStyle={{width: '100%', height: Dimensions.get("screen").height, resizeMode: 'cover'}}
      >
        <View style = {{margin: 20, alignItems: 'center', height: Dimensions.get("window").height*0.7, paddingTop: Dimensions.get("window").height*0.2}}>
            <Image
              source={otpicon}
            />     
            <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>Enter OTP</Text>
            <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 13, fontFamily: FONT.REGULAR}}>Please enter the code that we will send via SMS to proceed with your transaction</Text>
            <View style = {{flexDirection: 'row', marginTop: 25}}>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 1 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 2 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 3 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 4 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 5 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  !isInvalid && inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 6 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
            
            </View>
        </View>

        {isInvalid && retries < 5 &&
        <View style={{alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
          <Text style={{color: '#F6841F'}}>The OTP you entered is invalid. </Text>
          <Text style={{color: '#F6841F'}}>You have {5 - retries} retries remaining.</Text>
        </View>}

        {isInvalid && retries >= 5 && 
        <View style={{alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
          <Text style={{color: '#F6841F'}}>You have exceeded your retries to enter OTP.</Text>
        </View>}

        {!isInvalid && <View style={{height: 40}}/>}
      
        {!isInvalid && <TouchableOpacity 
          activeOpacity={0.5} 
          disabled={value.length != 6} 
          onPress={async () => {

            let transactionType = route.params?.transaction || null
            // let data = route.params?.data
            // let input = {
            //   requestTakeMoneyId: data.request_id,
            //   OTP:  data.pin_type == "OTP" ? value : "",
            //   TPIN:  data.pin_type == "TPIN" ? value : ""
            // }

            // console.log(input)

            // validatePin({
            //   variables: {
            //     input: input
            //   }
            // })

            if(value != "123456" || value != 123456){
              setIsInvalid(true)              
              setValue("")
            }else{
              setIsInvalid(false) 
              if(transactionType && transactionType == "payment"){
                await ProcessPayment()
              }
            }

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

      </ImageBackground>

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
