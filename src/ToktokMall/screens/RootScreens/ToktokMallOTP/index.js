import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon} from '../../../assets'
import { FONT_REGULAR } from '../../../../res/constants';

export const ToktokMallOTP =  ({navigation}) => {

  const ref_input1 = useRef()
  const ref_input2 = useRef()
  const ref_input3 = useRef()
  const ref_input4 = useRef()

  const [charOne, setCharOne] = useState('')
  const [charTwo, setCharTwo] = useState('')
  const [charThree, setCharThree] = useState('')
  const [charFour, setCharFour] = useState('')
  const [charOneEnabled, setCharOneEnabled] = useState(true)
  const [charTwoEnabled, setCharTwoEnabled] = useState(false)
  const [charThreeEnabled, setCharThreeEnabled] = useState(false)
  const [charFourEnabled, setCharFourEnabled] = useState(false)

  const changeChar = (no, char) => {
    console.log(char)
    // setCharOne(char)
    if(char == ''){
      if(no == 1){
        setCharOne(char)
      }
      if(no == 2){
        setCharTwo(char)
        ref_input1.current.focus()
      }
      if(no == 3){
        setCharThree(char)
        ref_input2.current.focus()
      }
      if(no == 4){
        setCharFour(char)
        ref_input3.current.focus()
      }
    }else{
      if(no == 1) {
        setCharOne(char)
        ref_input2.current.focus()
      }
      if(no == 2){
        setCharTwo(char)
        ref_input3.current.focus()
        
      }
      if(no == 3){
        setCharThree(char)
        ref_input4.current.focus()
      }
      if(no == 4){
        setCharFour(char)
        // ref_input3.current.focus()
      }
    }
    
  }

  const backSpace = (no) => {
    if(no == 1){
      //do nothing
    }
    if(no == 2){
      if(charTwo== ''){
        ref_input1.current.focus()
      }
    }
    if(no == 3){
      if(charThree== ''){
        ref_input1.current.focus()
      }
    }
    if(no == 4){
      if(charFour== ''){
        ref_input3.current.focus()
      }
    }
  }


  return (
    <>
      <View style = {styles.container}>
        <View style = {{margin: 20, alignItems: 'center', top: -20}}>
            <Image
            source = {otpicon}
            />     
            <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>Enter OTP</Text>
            <Text style = {{textAlign: 'center', fontSize: 14, fontFamily: FONT.REGULAR}}>Please enter the code that we will send via SMS to proceed with your transaction</Text>
            <View style = {{flexDirection: 'row', marginTop: 25}}>
            <View style = {styles.charContainer}>
              <TextInput 
                ref = {ref_input1}
                keyboardType = {'number-pad'}
                maxLength = {1}
                value = {charOne}
                onChangeText = {(text) => {changeChar(1, text)}}
                // onKeyPress = {(nativeEvent) => {console.log(nativeEvent.nativeEvent.key)}}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                ref = {ref_input2}
                keyboardType = {'number-pad'}
                maxLength = {1}
                value = {charTwo}
                onChangeText = {(text) => {changeChar(2, text)}}
                onKeyPress = {(nativeEvent) => {nativeEvent.nativeEvent.key === 'Backspace' ? backSpace(2): null}}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                ref = {ref_input3}
                keyboardType = {'number-pad'}
                maxLength = {1}
                value = {charThree}
                onChangeText = {(text) => {changeChar(3, text)}}
                onKeyPress = {(nativeEvent) => {nativeEvent.nativeEvent.key === 'Backspace' ? backSpace(4): null}}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                ref = {ref_input4}
                keyboardType = {'number-pad'}
                maxLength = {1}
                value = {charFour}
                onChangeText = {(text) => {changeChar(4, text)}}
                onKeyPress = {(nativeEvent) => {nativeEvent.nativeEvent.key === 'Backspace' ? backSpace(3): null}}
              />
            </View>
            </View>
        </View>
      
        <TouchableOpacity style = {styles.button}>
          <Text style = {styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
     
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
    height: 68,
    width: 60, 
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: 45,
    width: '80%',
    borderRadius: 5,
    backgroundColor: COLOR.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: FONT.REGULAR,
    fontSize: 16
  }
});
