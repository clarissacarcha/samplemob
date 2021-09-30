import React, {useState,useRef} from 'react'
import {View , Text , TextInput, StyleSheet , Modal , KeyboardAvoidingView, Platform, Dimensions , TouchableHighlight, TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { ICON_SET, VectorIcon } from 'src/revamp'
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import YellowButton from 'toktokfood/components/YellowButton';
import {moderateScale, getStatusbarHeight, getIphoneNotchSize} from 'toktokfood/helper/scale';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

const {width,height} = Dimensions.get("window")
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
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

const NumberBoxes = ({pinCode, onNumPress , showPin, errorMessage}) => {
    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin} errorMessage={errorMessage} />);
    }
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
        {numberBoxes}
      </View>
    );
 };

const EnterPinCode = ({
  visible,
  setVisible,
  loading,
  pinCodeAttempt,
  callBackFunc,
  errorMessage,
  children,
  setErrorMessage,
  title = 'OTP'
})=> {

  const [pinCode, setPinCode] = useState("")
  const inputRef = useRef();
  const [showPin,setShowPin] = useState(false)

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onBack = () => {
    setPinCode("")
    setVisible(false)
  }
   
  return (
    <>
     <Modal
        visible={visible}
        onRequestClose={onBack}
        transparent={false}
        style={{ flex: 1, zIndex: 1 }}
        statusBarTranslucent
      >
        {children}
        <HeaderImageBackground styleContainer={styles.header} searchBox={false}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={onBack}>
              <FIcon5 name="chevron-left" size={15} />
            </TouchableOpacity>
          </View>
        </HeaderImageBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 30} 
          style={styles.modalBody}
        >
          <View style={styles.pincodeContent}>
            <View style={{ alignItems:"center",paddingHorizontal: 16 }}>
              <Text style={styles.title}>Enter {title}</Text>
              <Text style={styles.description}>
                We have sent OTP to your mobile number. Please enter below to proceed with your toktokwallet transaction.
              </Text>
              <View style={{marginTop: 30,flexDirection:"row"}}>
                <NumberBoxes
                  pinCode={pinCode}
                  onNumPress={onNumPress}
                  showPin={showPin}
                  errorMessage={errorMessage}
                />
                <TextInput
                  caretHidden
                  value={pinCode}
                  ref={inputRef}
                  style={styles.textInput}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={(value) => {
                    setErrorMessage('')
                    if(value.length <= 6) {
                      setPinCode(value);
                    }
                  }}
                />
              </View>
              { !!errorMessage && (
                <Text style={styles.errorMsg}>
                  {errorMessage}
                </Text>
              )}
              <TouchableOpacity
                style={styles.showPin}
                onPress={()=>setShowPin(!showPin)}
              >
                <Text style={styles.txtShowPin}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ alignSelf: 'center', paddingVertical: 20 }}>
            <YellowButton
              onPress={() => { 
                setPinCode('')
                callBackFunc(pinCode)
              }}
              label='Confirm'
              disabled={pinCode.length < 6}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
    backgroundColor:"white"
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
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    paddingVertical: moderateScale(70)
  },
  description: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    textAlign: 'center'
  },
  textInput: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    color: 'transparent'
  },
  errorMsg: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    color: '#FF322A'
  },
  showPin: {
    marginTop: 18,
    paddingVertical: 10,
    alignItems: "center"
  },
  txtShowPin: {
    color: COLOR.ORANGE,
    fontSize:FONT_SIZE.M,
    fontFamily: FONT.BOLD
  },
  header: {
    justifyContent: 'center',
    marginTop: getIphoneNotchSize
  },
  backContainer: {
    justifyContent: 'center',
    marginTop: getStatusbarHeight,
    paddingHorizontal: 16
  }
})
export default EnterPinCode;
