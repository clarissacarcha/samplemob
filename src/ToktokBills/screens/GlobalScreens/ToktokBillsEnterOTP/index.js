import React , {useState , useEffect , useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { HeaderBack, HeaderTitle, Separator, OrangeButton, NumberBoxes } from 'toktokbills/components';
import { moderateScale } from 'toktokbills/helper'
import { usePrompt } from 'src/hooks'
import { useAccount } from 'toktokwallet/hooks'

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE} = CONSTANTS

export const ToktokBillsEnterOTP = ({navigation, route})=> {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokbills"} isRightIcon/>,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });
  
  const { paymentData } = route.params
  const prompt = usePrompt();
  const [pinCode, setPinCode] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const inputRef = useRef();
  const {tokwaAccount, getMyAccount} = useAccount()
  const [otpTimer, setOtpTimer] = useState(120)

  useEffect(()=>{
    if(!tokwaAccount.mobileNumber){
      getMyAccount();
    }
  },[])

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onPressConfirm = () => {
    prompt({
      type: "success",
      title: "Payment Successful",
      message: `Your payment to PLDT amounting to ₱ 2100.00 has been successfully processed with ref no. 0987654321 on September 15, 2021, 5:00 pm.`,
      onPress: ()=> { navigation.navigate("ToktokBillsReceipt", { paymentData }) }
    })
  }

  return (
    <>
    <Separator/>
    <KeyboardAvoidingView 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <View style={styles.subContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.otpText}>Enter OTP</Text>
          <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={true} isError={errorMessage != ""} />
          <TextInput
            caretHidden
            value={pinCode}
            ref={inputRef}
            style={styles.input}
            keyboardType="number-pad"
            returnKeyType="done"
            onChangeText={(value) => {
              if (value.length <= 6) {
                const code = value.replace(/[^0-9]/,"")
                setPinCode(code);
              }
            }}
          />
          { errorMessage != "" && <Text style={styles.errorText}>{errorMessage}</Text> }
        </View>
        <OrangeButton
          disabled={pinCode.length < 6}
          label="Confirm"
          onPress={onPressConfirm}
        />
      </View>
    </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    padding: moderateScale(16)
  },
  inputContainer: {
    flex: 1,
    alignItems:"center",
    marginTop: moderateScale(100)
  },
  otpText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    marginBottom: moderateScale(30)
  },
  input: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    color: 'transparent'
  },
  errorText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.RED,
    marginHorizontal: moderateScale(16)
  }
})