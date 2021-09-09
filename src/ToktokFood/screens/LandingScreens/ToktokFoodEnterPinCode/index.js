import React, {useState,useRef} from 'react'
import {View , Text , TextInput, StyleSheet , Modal , KeyboardAvoidingView, Platform, Dimensions , TouchableHighlight, TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { ICON_SET, VectorIcon } from 'src/revamp'
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import YellowButton from 'toktokfood/components/YellowButton';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const {width,height} = Dimensions.get("window")
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const numWordArray = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "10": "ten"
}

const NumberBox = ({onPress,value, showPin, errorMessage}) => (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={COLOR.YELLOW}
      style={{ borderRadius: 5, marginHorizontal: 5 }}
    >
      <View style={[styles.inputView, { borderColor: errorMessage ? '#FF322A' : '#FFA700' }]}>
        <Text style={{fontSize: 25, fontFamily: FONT.BOLD}}>{value ? showPin ? value : "•" : ''}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress , showPin }) => {
    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
        {numberBoxes}
      </View>
    );
 };

const EnterPinCode = ({ loading, errorMessage })=> {

    const [pinCode, setPinCode] = useState("")
    const inputRef = useRef();
    const [showPin,setShowPin] = useState(false)

    const onNumPress = () => {
      setTimeout(() => {
        inputRef.current.focus();
      }, 10);
    };
   
  return (
    <>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle />
      </HeaderImageBackground>
      {/* <AlertOverlay loading={loading}/> */}
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 30} 
        style={styles.modalBody}
      >
        <View style={styles.pincodeContent}>
          <View style={{ alignItems:"center",paddingHorizontal: 16 }}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L, paddingVertical: moderateScale(70)}}>Enter OTP</Text>
            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, textAlign: 'center'}}>
              We have sent OTP to your mobile number. Please enter below to proceed with your toktokwallet transaction.
            </Text>
            <View style={{marginTop: 30,flexDirection:"row"}}>
              <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
              <TextInput
                caretHidden
                value={pinCode}
                ref={inputRef}
                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(value) => {
                  if(value.length <= 6) {
                    setPinCode(value);
                  }
                }}
              />
            </View>
            { errorMessage && (
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, textAlign: 'center', color: '#FF322A'}}>
                Incorrect OTP. Please try again.
              </Text>
            )}
            <TouchableOpacity
              style={{marginTop: 18,paddingVertical: 10, alignItems: "center"}}
              onPress={()=>setShowPin(!showPin)}
            >
              <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={{ backgroundColor: 'whitesmoke' }}>
        <View style={{ alignSelf: 'center', paddingVertical: 20 }}>
          <YellowButton label='Confirm' disabled={pinCode.length < 6} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
    backgroundColor:"whitesmoke"
  },
  content: {
    justifyContent:"center",
    alignItems: "center",
    flex: 1,
  },
  pincodeContent: {
    flex: 1,
  },
  inputView: {
    borderRadius: 5,
    height: 50,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 20,
    fontSize: 25,
    width: 30,
  },
  proceedBtn: {
    height: 70,
    width: "100%",
    padding: 16,
    justifyContent:"flex-end"
  },
  backBtn: {
    backgroundColor:"#F7F7FA",
    top: Platform.OS == "ios" ? 40 : 10, 
    left: 16,
    position:"absolute",
    zIndex: 1,
    justifyContent:"center",
    alignItems:"center",
    borderRadius: 100,
    height: 35,
    width: 35,
  }
})
export default EnterPinCode;
