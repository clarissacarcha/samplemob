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

export const ValidatorMaxRequest =  ({onValidate}) => {

  const navigation = useNavigation();
  const Context = useContext(TPINOTPContext)
  const [isVisible, setIsVisible] = useState(true)
	const [timeRemaining, setTimeRemaining] = useState(0)

	useEffect(() => {
		if(Context.lockMessage && Context.lockMessage.includes("reached maximum TPIN/OTP attempts")){
			// console.log(Context.lockMessage?.split("after "))
			setTimeRemaining(Context.lockMessage?.split("after ")[1].split(" minutes")[0])
		}		
	}, [Context])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  return (
    <View style={{flex: 1, backgroundColor: "#FFF"}}>

      {/* <ImageBackground 
        source={otpbg}
        style = {styles.container}
        imageStyle={{width: '100%', height: Dimensions.get("screen").height, resizeMode: 'cover'}}
      > */}
      <TpinMaxAttemptModal
        // navigation = {navigation}
        isVisible = {isVisible}
        setIsVisible = {setIsVisible}
        minutes = {timeRemaining} // minutes params / remaning time until user can enter tpin again
      />

      <View style = {styles.container} >
        <View style = {{margin: 20, alignItems: 'center', height: Dimensions.get("window").height*0.8, paddingTop: Dimensions.get("window").height*0.15}}>
            <Image
              source={otpicon2}
            />     
            <>
              <Text style = {{fontFamily: FONT.BOLD, fontSize: 17, marginTop: 25, marginBottom:10}}>No Attempts Left</Text>
              <Text style = {{textAlign: 'center', paddingHorizontal: 15, fontSize: 14, fontFamily: FONT.REGULAR}}>
                {Context.lockMessage}
              </Text>
            </>
            
        </View>

    

        <View style={{height: 35}}/>
				<TouchableOpacity 
            activeOpacity={1} 
            onPress={async () => {
              navigation.pop(2)
            }} 
            style={styles.activeButton}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}
     
    </View>
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
