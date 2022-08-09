import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import {ICON_SET, VectorIcon} from 'src/revamp';
import {AlertOverlay} from 'src/components';
import {
  CheckIdleState,
  DisabledButton,
  NumberBoxes,
  HeaderCancel,
  CircleIndicator,
  NumPad,
  HeaderBack,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {BuildingBottom} from '../../../components';
import {TransactionUtility} from 'toktokwallet/util';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VERIFY_ACCOUNT_TPIN} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useAlert, usePrompt} from 'src/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import tokwaLogo from 'toktokwallet/assets/images/tokwa2.png';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {backgrounds} from 'toktokwallet/assets';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const MainComponent = ({navigation, route}) => {
  const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null;
  // const errorMessage = route?.params?.errorMessage ? route.params.errorMessage : null;
  const data = route?.params?.data ? route.params.data : null;
  const btnLabel = route?.params?.btnLabel ? route.params.btnLabel : 'Proceed';
  const screenPopNo = route?.params?.screenPopNo ? route.params.screenPopNo : 4;
  const onPressCancelYes = route?.params?.onPressCancelYes ? route.params.onPressCancelYes : null;

  navigation.setOptions({
    headerShown: false,
  });

  const [pinCode, setPinCode] = useState('');
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const prompt = usePrompt();
  const alert = useAlert();
  const [errorMessage, setErrorMessage] = useState('');

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const [postVerifyAccountTPIN, {loading}] = useMutation(POST_VERIFY_ACCOUNT_TPIN, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postVerifyAccountTPIN}) => {
      return callBackFunc({pinCode, data});
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) setPinCode('');
      TransactionUtility.StandardErrorHandling({
        error,
        setErrorMessage,
        navigation,
        prompt,
        alert,
      });
    },
  });

  useEffect(() => {
    if (pinCode.length > 0) {
      setErrorMessage('');
    }
    if (pinCode.length == 6) {
      postVerifyAccountTPIN({
        variables: {
          input: {
            tpin: pinCode,
          },
        },
      });
      // callBackFunc({pinCode , data})
    }
  }, [pinCode]);

  // useEffect(() => {
  //   if (errorMessage != '') {
  //     setPinCode('');
  //   }
  // }, [errorMessage]);

  const onPressForgotTPIN = () => {
    navigation.navigate('ToktokWalletRecoveryMethods', {type: 'TPIN', event: 'enterprise'});
  };

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <ImageBackground source={backgrounds.gradient_tpin} style={styles.subContainer}>
        <View style={{marginTop: Platform.OS === 'ios' ? moderateScale(16) : getStatusbarHeight + moderateScale(16)}}>
          <HeaderBack color={COLOR.ORANGE} />
        </View>
        <View style={styles.inputContainer}>
          <Image source={tokwaLogo} style={styles.tokwaLogo} />
          <Text style={styles.otpText}>Enter TPIN</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(20)}}>
            <VectorIcon iconSet={ICON_SET.AntDesign} name="exclamationcircle" size={15} color={COLOR.YELLOW} />
            <Text style={styles.otpMessage}>Do not share your TPIN with anyone.</Text>
          </View>
          <CircleIndicator pinCode={pinCode} showPin={showPin} error={!!errorMessage} />
          {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <View style={{paddingBottom: moderateScale(10)}}>
            <NumPad setPinCode={setPinCode} pinCode={pinCode} />
          </View>
          <TouchableOpacity onPress={onPressForgotTPIN} style={{marginVertical: moderateScale(20)}}>
            <Text style={styles.forgotTPIN}>Forgot TPIN?</Text>
          </TouchableOpacity>
        </View>
        {/* <BuildingBottom /> */}
      </ImageBackground>
    </CheckIdleState>
  );
};

export const ToktokWalletTPINValidator = ({navigation, route}) => {
  const enableIdle = route?.params?.enableIdle != undefined ? route?.params.enableIdle : true;

  if (enableIdle) {
    return (
      <CheckIdleState>
        <MainComponent navigation={navigation} route={route} />
      </CheckIdleState>
    );
  } else {
    return <MainComponent navigation={navigation} route={route} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
  },
  otpText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    marginBottom: moderateScale(5),
  },
  input: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    color: 'transparent',
  },
  errorText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#ED3A19',
    marginHorizontal: moderateScale(16),
    textAlign: 'center',
    marginTop: moderateScale(10),
  },
  forgotTPIN: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
  },
  otpMessage: {
    fontSize: FONT_SIZE.M,
    marginLeft: moderateScale(5),
  },
  tokwaLogo: {
    width: moderateScale(200),
    height: moderateScale(80),
    resizeMode: 'contain',
  },
});
