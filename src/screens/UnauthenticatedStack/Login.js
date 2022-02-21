import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAlert } from '../../hooks/useAlert';
import { APP_FLAVOR, DARK, MEDIUM, ORANGE,SIZES } from '../../res/constants';
import constants from '../../common/res/constants';
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../res/variables';
import { AUTH_CLIENT, LOGIN_REGISTER } from '../../graphql';
import { AlertOverlay, AlertModal } from '../../components';
import LoginBanner from '../../assets/images/ToktokLogo.png';
import SmsRetriever from 'react-native-sms-retriever';
import Splash from '../../assets/images/LinearGradiant.png';
import { connect } from 'react-redux';
import { onError, onErrorAlert } from '../../util/ErrorUtility';
import { useMutation } from '@apollo/react-hooks';

const imageWidth = Dimensions.get('window').width - 80;

const Login = ({ navigation, session }) => {
  const [mobile, setMobile] = useState('');
  const [delay, setDelay] = useState(true);

  const alert = useAlert();

  const [loginRegister, { loading }] = useMutation(LOGIN_REGISTER, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        appFlavor: APP_FLAVOR,
      },
    },
    onError: (error) => {
      onErrorAlert({ alert, error });
    },
    onCompleted: (data) => {
      if (data.loginRegister === 'REGISTER') {
        navigation.push('SmsVerification', { mobile });
      }

      if (data.loginRegister === 'LOGIN') {
        navigation.push('PasswordVerification', { mobile });
      }

      setMobile(''); //empty out the mobile number
    },
  });

  // const ws = new WebSocket('wss://echo.websocket.org');
  //
  // ws.onopen = () => {
  //   ws.send('Sent Message!');
  // };
  //
  // ws.onmessage = e => {
  //   alert(e.data);
  // };

  const onMobileChange = (value) => {
    if (value.length == 1 && value == '0') {
      setMobile('');
      return;
    }

    if (value.length > 10) {
      setMobile(mobile);
      return;
    }

    setMobile(value);
  };

  useEffect(() => {
    setTimeout(() => {
      setDelay(false);
    }, 200);
  }, []);

  // Get the phone number (first gif)
  const onRequestAutoFill = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      setMobile(phoneNumber.slice(3, phoneNumber.length));
      onSubmit(phoneNumber.slice(3, phoneNumber.length));
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  // Get the SMS message
  const onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        alert('Started Listener');
        SmsRetriever.addSmsListener((event) => {
          alert('EVENT: ' + JSON.stringify(event, null, 4));
          SmsRetriever.removeSmsListener();
        });
      } else {
        alert('Not Registered');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const onSubmit = (phoneNumber) => {
    if (phoneNumber.length !== 10) {
      Alert.alert('', 'Please enter a valid mobile number.');
      return;
    }
    loginRegister();
  };

  if (delay) {
    return (
      <ImageBackground
        resizeMode="cover"
        source={Splash}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems:'center'
        }}>
        <Image
          source={LoginBanner}
          style={{ height: imageWidth - 70, width: imageWidth - 150 , marginBottom: "30%", }}
          resizeMode="contain"
        />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={Splash}
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <AlertOverlay visible={loading} />
      {/* <AlertModal visible={true} /> */}
      <View style={{flex:1,justifyContent:'center',alignItems:'center',marginBottom:"20%"}}>
        <Image
          source={LoginBanner}
          style={{ height: imageWidth - 70, width: imageWidth - 150 }}
          resizeMode="contain"
        />
        {/* <View style={{height: 50, paddingHorizontal: 20, justifyContent: 'flex-end', marginBottom: 10}}>
          <Text style={{fontFamily: FONT.BOLD, color: COLOR.BLACK}}>{`Enter your ${
            APP_FLAVOR == 'C' ? 'mobile' : 'rider'
          } number to continue.`}</Text>
        </View> */}

        {/*-------------------- INPUT ROW --------------------*/}
       <View style={{ flexDirection: 'row', marginHorizontal: 35 }}>
          <View style={styles.inputView}>
            <Text style={{ fontSize: 13, color: DARK }}>+63</Text>
          </View>
          <TextInput
            value={mobile}
            onChangeText={onMobileChange}
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={() => onSubmit(mobile)}
            placeholderTextColor={MEDIUM}
          />
          
        </View>

        <TouchableHighlight onPress={() => onSubmit(mobile)} underlayColor={COLOR.ORANGE} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{ color: COLOR.WHITE, fontSize: FONT_SIZE.M,paddingHorizontal:'37%',fontWeight:"600",lineHeight:SIZES.L,fontFamily: constants.FONT_FAMILY.BOLD }}>Continue</Text>
        </View>
      </TouchableHighlight>

        {/* -------------------- FORGOT PASSWORD BUTTON--------------------*/}
        {/* <TouchableHighlight
          onPress={() => navigation.push('ForgotPasswordRequest')}
          underlayColor={COLOR.YELLOW}
          style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR.YELLOW, fontSize: 12}}>Forgot Password?</Text>
          </View>
        </TouchableHighlight> */}

        {/*-------------------- AUTO Fill BUTTON --------------------*/}
        {/* <TouchableHighlight onPress={onRequestAutoFill} underlayColor={COLOR} style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR, fontSize: 20}}>Auto Fill</Text>
          </View>
        </TouchableHighlight> */}
          {/*-------------------- SUBMIT BUTTON --------------------*/}
    
      </View>

    
    </ImageBackground>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Login);

const styles = StyleSheet.create({
  inputView: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderTopLeftRadius: SIZE.BORDER_RADIUS,
    borderBottomLeftRadius: SIZE.BORDER_RADIUS,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 40,
    backgroundColor:'#F8F8F8',  
    borderColor: "#F8F8F8",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: FONT_SIZE.M,
    lineHeight: SIZES.L,
    height: 40,
    color: DARK,
    borderTopRightRadius: SIZE.BORDER_RADIUS,
    borderBottomRightRadius: SIZE.BORDER_RADIUS,
    backgroundColor:'#F8F8F8',
    borderTopColor: '#F8F8F8',
    borderBottomColor: '#F8F8F8',
    borderRightColor: "#F8F8F8",
    borderLeftColor:"#CCCCCC",
    fontWeight:"400"
  },
  submitBox: {
    margin: 16,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: ORANGE,
    height: 40,
    borderRadius: SIZE.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoFillBox: {
    margin: 20,
    borderRadius: SIZE.BORDER_RADIUS,
    // width: 100,
    alignSelf: 'flex-end',
  },

  autoFill: {
    backgroundColor: DARK,
    height: 30,
    borderRadius: SIZE.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 50,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
});
