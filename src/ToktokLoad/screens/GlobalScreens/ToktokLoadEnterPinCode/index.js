import React , {useState , useEffect , useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, OrangeButton, NumberBoxes, BuildingBottom } from 'toktokload/components';
import { AlertOverlay } from 'src/components';

//HELPER & UTIL
import { moderateScale, numberFormat } from 'toktokload/helper';
import { ErrorUtility } from 'toktokload/util';

//GRAPHQL & HOOKS
import { useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_LOAD_TRANSACTION } from 'toktokload/graphql/model';
import { useAccount } from 'toktokwallet/hooks';
import { usePrompt, useAlert } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useSelector } from 'react-redux';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants'
import moment from 'moment';

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE} = CONSTANTS

export const ToktokLoadEnterPinCode = ({navigation, route})=> {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} isRightIcon/>,
  });
  

  const prompt = usePrompt();
  const inputRef = useRef();
  const alert = useAlert();
  const { user } = useSelector((state) => state.session);
  const { paymentSummary } = route.params;
  const { requestMoneyDetails, loadDetails, mobileNumber, tokwaBalance } = paymentSummary;
  const totalAmount = parseFloat(loadDetails.amount) + parseFloat(loadDetails.commissionRateDetails.systemServiceFee);

  const [pinCode, setPinCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {tokwaAccount, getMyAccount} = useAccount();
  const [otpTimer, setOtpTimer] = useState(120);
  const [showPin, setShowPin] = useState(false);

  const [postLoadTransaction, {loading, error}] = useMutation(POST_LOAD_TRANSACTION, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        setErrorMessage,
        prompt
      });
    },
    onCompleted: ({ postLoadTransaction }) => {
      // prompt({
      //   type: "success",
      //   title: "Thank you",
      //   message: `₱ ${numberFormat(loadDetails.amount)} prepaid credit was loaded to your mobile number`,
      //   onPress: () => { navigation.navigate("ToktokLoadReceipt", { receipt: postLoadTransaction.data  }) }
      // });
      navigation.navigate("ToktokLoadReceipt", { receipt: postLoadTransaction.data  })
    }
  })

  useEffect(()=>{
    const unsubscribe = navigation.addListener('blur', (e) => {
      setPinCode("");
      setErrorMessage("");
    });

    return unsubscribe;
  },[navigation])

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onPressConfirm = () => {
    let {firstName, lastName} = user.person;
    let formattedMobile = user.username.substring(1, user.username.length);
    let input = {
      requestMoneyDetails: {
        requestTakeMoneyId: requestMoneyDetails.requestTakeMoneyId,
        TPIN: requestMoneyDetails.validator === "TPIN" ? pinCode : "",
        OTP: requestMoneyDetails.validator === "OTP" ? pinCode : "",
      },
      referenceNumber: requestMoneyDetails.referenceNumber,
      senderName: `${firstName} ${lastName}`,
      senderMobileNumber: formattedMobile,
      destinationNumber: mobileNumber,
      loadItemId: loadDetails.id,
      senderWalletBalance: parseFloat(tokwaBalance),
      amount: parseFloat(loadDetails.amount),
      convenienceFee: parseFloat(loadDetails.commissionRateDetails.systemServiceFee),
      senderWalletEndingBalance: parseFloat(tokwaBalance) - totalAmount,
      comRateId: loadDetails.comRateId,
      referralCode: user.consumer.referralCode,
      email: user.person.emailAddress
    }

    postLoadTransaction({
      variables: {
        input
      }
    });
  }

  const onPressForgotTPIN = () => {
    navigation.navigate("ToktokWalletRecoveryMethods", {type: "TPIN", event: "enterprise"})
  }

  const onPressShowTPIN = () => {
    setShowPin(prev => (!prev))
  }

  return (
    <View style={styles.subContainer}>
      <AlertOverlay visible={loading}/>
      <View style={styles.inputContainer}>
        <Text style={styles.otpText}>Enter {requestMoneyDetails?.validator} </Text>
        <View style={{flexDirection:"row"}}>
          <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin} isError={errorMessage != ""} />
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
                setErrorMessage("")
              }
            }}
          />
        </View>
        { errorMessage != "" && <Text style={styles.errorText}>{errorMessage}</Text> }
        { requestMoneyDetails?.validator === "TPIN" && (
          <>
            <TouchableOpacity style={{ marginVertical: moderateScale(50) }} onPress={onPressShowTPIN}>
              <Text style={styles.forgotTPIN}>{showPin ? "Hide TPIN" : "Show TPIN"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressForgotTPIN}>
              <Text style={styles.forgotTPIN}>Forgot TPIN?</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <OrangeButton
        disabled={pinCode.length < 6}
        label="Confirm"
        onPress={onPressConfirm}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: "white",
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
    marginHorizontal: moderateScale(16),
    textAlign: "center"
  },
  forgotTPIN: {
    color: "#FF8A48",
    fontSize: FONT_SIZE.M
  }
})