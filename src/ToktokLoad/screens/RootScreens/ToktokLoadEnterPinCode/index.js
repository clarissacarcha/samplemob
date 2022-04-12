import React , {useState , useEffect , useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native';

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, HeaderCancel } from 'toktokload/components';
import { NumPad, CircleIndicator, BuildingBottom } from 'toktokwallet/components';
import { AlertOverlay } from 'src/components';
import {VectorIcon, ICON_SET} from 'src/revamp';

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

//IMAGES, FONTS AND COLORS 
import CONSTANTS from 'common/res/constants'
import {toktokload_logo} from 'toktokload/assets/images';
import tokwaLogo from 'toktokwallet/assets/images/tokwa2.png'

import moment from 'moment';

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE} = CONSTANTS

export const ToktokLoadEnterPinCode = ({navigation, route})=> {

  navigation.setOptions({
    headerLeft: ()=> <HeaderBack color={COLOR.YELLOW} isThinBack />,
    headerTitle: ()=> <HeaderTitle label={[""]}/>,
    headerRight: ()=> <HeaderCancel navigation={navigation} onPressYes={() => navigation.pop(3) } />,
    headerStyle: {
      elevation: 0,
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
    }
  })
  

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
    if(pinCode.length > 0) setErrorMessage("")
    if(pinCode.length == 6){
      onPressConfirm();
    }
  },[pinCode])

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
      senderFirstName: firstName,
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
        <Image source={tokwaLogo} style={{ width: moderateScale(200), height: moderateScale(80), resizeMode: "contain" }} />
        <Text style={styles.otpText}>Enter {requestMoneyDetails?.validator}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: moderateScale(30) }}>
          <VectorIcon iconSet={ICON_SET.AntDesign} name="exclamationcircle" size={15} color={COLOR.YELLOW} />
          <Text style={styles.otpMessage}>Do not share your TPIN with anyone.</Text>
        </View>
        <CircleIndicator pinCode={pinCode} showPin={showPin} error={!!errorMessage} />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <View style={{ paddingBottom: moderateScale(10) }}>
          <NumPad setPinCode={setPinCode} pinCode={pinCode} />
        </View>
        { requestMoneyDetails?.validator === "TPIN" && (
          <TouchableOpacity onPress={onPressForgotTPIN} style={{ marginVertical: moderateScale(20) }}>
            <Text style={styles.forgotTPIN}>Forgot TPIN?</Text>
          </TouchableOpacity>
        )}
      </View>
      <BuildingBottom/>
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
    justifyContent: "center"
  },
  otpText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    marginBottom: moderateScale(5)
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
    color: "#ED3A19",
    marginHorizontal: moderateScale(16),
    textAlign: "center",
    marginTop: moderateScale(10)
  },
  forgotTPIN: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD
  },
  otpMessage: {
    fontSize: FONT_SIZE.M,
    marginLeft: moderateScale(5)
  },
})