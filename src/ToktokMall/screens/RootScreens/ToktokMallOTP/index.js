import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon} from '../../../assets'
import { FONT_REGULAR } from '../../../../res/constants';

export const ToktokMallOTP =  ({navigation}) => {


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
                keyboardType = {'number-pad'}
                maxLength = {1}
                textContentType = {'password'}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                keyboardType = {'number-pad'}
                maxLength = {1}
                textContentType = {'password'}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                keyboardType = {'number-pad'}
                maxLength = {1}
                textContentType = {'password'}
              />
            </View>
            <View style = {styles.charContainer}>
              <TextInput 
                keyboardType = {'number-pad'}
                maxLength = {1}
                textContentType = {'password'}
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
