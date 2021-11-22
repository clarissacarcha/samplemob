import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, StyleSheet, Platform, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput, ScrollView, BackHandler} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header, LoadingOverlay} from '../../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {otpicon, otpbg, otpicon2} from '../../../../assets';
import CustomIcon from '../../../../Components/Icons';
import Toast from "react-native-simple-toast";
import { FONT_REGULAR } from '../../../../../res/constants';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TPINOTPContext } from '../ContextProvider';
import {TpinMaxAttemptModal} from '../../../../Components/Widgets'
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';

export const TPIN =  ({onValidate}) => {

  const navigation = useNavigation();
  const Context = useContext(TPINOTPContext)
  const inputRef = useRef(null)  
  const maximumAttempts = 3
  const [isVisible, setIsVisible] = useState(Context.isInvalid && Context.retries >= maximumAttempts ? true : false)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {        
        return false
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  return (
    <KeyboardAwareScrollView style={{backgroundColor: "#FFF"}}>

      {/* <ImageBackground 
        source={otpbg}
        style = {styles.container}
        imageStyle={{width: '100%', height: Dimensions.get("screen").height, resizeMode: 'cover'}}
      > */}
      <TpinMaxAttemptModal
        // navigation = {navigation}
        isVisible = {Context.retries >= maximumAttempts}
        setIsVisible = {setIsVisible}
        minutes = {30} // minutes params / remaning time until user can enter tpin again
      />
      <View style = {styles.container} >
        <View style = {{margin: 20, alignItems: 'center', height: Dimensions.get("window").height*0.8, paddingTop: Dimensions.get("window").height*0.15}}>
            <Image
              source={otpicon2}
            />     
            {
              Context.isInvalid && Context.retries >= maximumAttempts  ? //enter condition here for checking if user has available attempts left
              <>
                <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>No Attempts Left</Text>
                <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 14, fontFamily: FONT.REGULAR}}>
                  {Context.lockMessage}
                </Text>
              </> : 
              // else
              <>
                <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>Enter TPIN</Text>
                <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 13, fontFamily: FONT.REGULAR}}>Please enter your TPIN below to proceed with your toktokwallet transaction. </Text>
                <View style = {{flexDirection: 'row', marginTop: 25}}>
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 1 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 2 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 3 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 4 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ?1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 5 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      !Context.isInvalid && inputRef.current.focus()
                    }} style = {[styles.charContainer, {borderWidth: Context.isInvalid ? 1 : 0, borderColor: COLOR.ORANGE}]}>              
                    {Context.value.length >= 6 && <CustomIcon.EIcon name="dot-single" size={40} />}
                  </TouchableOpacity>
                </View>
              </>
            }
          
          {Context.isInvalid && Context.retries < maximumAttempts &&
          <>
          <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
            <Text style={{color: '#F6841F'}}>Sorry, the TPIN you've entered is incorrect. </Text>
            <Text style={{color: '#F6841F'}}>You only have ({Context.retries}) attempts left.</Text>
          </View>
          <View style={{height: 35}} />
          </>
          }
            
        </View>

        

        {/* { //true &&
          isInvalid && retries >= 5 && 
        <View style={{alignItems: 'center', paddingHorizontal: 15, justifyContent: 'center', paddingBottom: 10}}>
          <Text style={{color: '#F6841F'}}>You have exceeded your retries to enter OTP.</Text>
        </View>} */}

        <View style={{height: 35}}/>

      
        {!Context.isInvalid && <TouchableOpacity 
          activeOpacity={0.5} 
          disabled={Context.value.length != 6} 
          onPress={async () => {

            await onValidate()

          }} 
          style={Context.value && Context.value.length == 6 ? styles.activeButton : styles.invalidButton}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>}

        {Context.isInvalid && Context.value == "" && Context.retries < maximumAttempts &&

          <TouchableOpacity 
            activeOpacity={0.5} 
            onPress={async () => {
              Context.setIsInvalid(false)  
              Context.setretries(Context.retries + 1)
            }} 
            style={styles.activeButton}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        }

        {Context.isInvalid && Context.retries >= maximumAttempts && // put condition here for 0 attempts available

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
          value={Context.value}
          onChangeText={(val) => {
            Context.setValue(val)
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
