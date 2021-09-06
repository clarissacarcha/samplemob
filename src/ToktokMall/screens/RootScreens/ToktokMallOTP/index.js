import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon, otpbg} from '../../../assets';
import CustomIcon from '../../../Components/Icons';
import Toast from "react-native-simple-toast";
import { FONT_REGULAR } from '../../../../res/constants';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";

export const ToktokMallOTP =  ({navigation, route}) => {

  const inputRef = useRef(null)
  const [value, setValue] = useState("")

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

  return (
    <>
      <ImageBackground 
        source={otpbg}
        style = {styles.container}
        imageStyle={{width: '100%', height: Dimensions.get("screen").height, resizeMode: 'cover'}}
      >
        <View style = {{margin: 20, alignItems: 'center', top: -20}}>
            <Image
              source={otpicon}
            />     
            <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>Enter OTP</Text>
            <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 13, fontFamily: FONT.REGULAR}}>Please enter the code that we will send via SMS to proceed with your transaction</Text>
            <View style = {{flexDirection: 'row', marginTop: 25}}>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 1 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 2 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 3 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 4 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 5 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  inputRef.current.focus()
                }} style = {styles.charContainer}>              
                {value.length >= 6 && <CustomIcon.EIcon name="dot-single" size={40} />}
              </TouchableOpacity>
            
            </View>
        </View>

        <TextInput 
          ref={inputRef} 
          keyboardType = {'number-pad'}
          maxLength = {6}
          style={{width: 0, height: 0}} 
          value={value}
          onChangeText={(val) => {
            setValue(val)
          }}
        />
      
        <TouchableOpacity 
          activeOpacity={0.5} 
          disabled={value.length != 6} 
          onPress={async () => {

            let transactionType = route.params?.transaction || null

            if(transactionType && transactionType == "payment"){
              await ProcessPayment()
            }

          }} 
          style={value && value.length == 6 ? styles.activeButton : styles.invalidButton}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>

      </ImageBackground>
     
    </>
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
    position: 'absolute',
    bottom: 20,
  },
  invalidButton: {
    // height: 45,
    paddingVertical: 15,
    width: '80%',
    borderRadius: 5,
    backgroundColor: "#D7D7D7",
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: FONT.REGULAR,
    fontSize: 14
  }
});
