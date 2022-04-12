import {AUTH_CLIENT, FORGOT_PASSWORD_RESET} from '../../graphql';
import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {AlertOverlay, HeaderBack, HeaderTitle} from '../../components';
import {COLOR, DARK, LIGHT, MEDIUM, ACCOUNT_TYPE} from '../../res/constants';
import React, {useEffect, useState} from 'react';
import Splash from '../../assets/images/LinearGradiant.png';
import ToktokGoIcon from '../../assets/images/ToktokGoIcon.png';
import constants from '../../common/res/constants';
import {connect} from 'react-redux';
import {onError} from '../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';
import validator from 'validator';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import EIcons from 'react-native-vector-icons/AntDesign';
import ArrowLeft from '../../assets/icons/arrow-left-icon.png';
import {SuccessResetPasswordModal} from './Components';
const PasswordValidationIcon = ({errorList, validation_number}) => {
  return errorList.includes(validation_number) ? (
    <AntIcons name={'closecircle'} color={constants.COLOR.RED} size={11} style={{marginHorizontal: 8}} />
  ) : (
    <EIcons name={'checkcircle'} color={constants.COLOR.GREEN} size={11} style={{marginHorizontal: 8}} />
  );
};
const PostRegistration = ({navigation, route}) => {
  const goToLogin = () => {
    navigation.navigate('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  // navigation.setOptions({
  //   headerLeft: () => <HeaderBack onBack={goToLogin} />,
  //   headerTitle: () => <HeaderTitle label={['Reset', 'Password']} />,
  // });

  const {mobile, verificationCode} = route.params;
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [onFocusNewPassword, setOnFocusNewPassword] = useState(false);
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState([]);
  const [validation, setValidation] = useState(true);
  const [onFocusConfirmPassword, setOnFocusConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [successModal, setSuccessModal] = useState(false);

  const [forgotPasswordReset, {loading}] = useMutation(FORGOT_PASSWORD_RESET, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        accountType: ACCOUNT_TYPE,
        mobile: `+63${mobile}`,
        verificationCode,
        password,
      },
    },
    onError: onError,
    onCompleted: ({forgotPasswordReset}) => {
      // Alert.alert('', forgotPasswordReset, [
      //   {
      //     title: 'Ok',
      //     onPress: goToLogin,
      //   },
      // ]);
      setSuccessModal(true);
    },
  });

  const onSubmit = () => {
    if (password == '') {
      Alert.alert('', 'Please enter your password.');
      return;
    }

    if (repeatPassword == '') {
      Alert.alert('', 'Please repeat your password.');
      return;
    }

    if (password != repeatPassword) {
      Alert.alert('', 'Password does not match.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('', 'Password must have minimum length of 8 characters.');
      return;
    }

    // if (!validator.isAlphanumeric(password)) {
    //   Alert.alert('', `Password can only contain letters and numbers.`);
    //   return;
    // }

    forgotPasswordReset();
  };
  useEffect(() => {
    if (password !== repeatPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [repeatPassword, password]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      goToLogin();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const passwordVerifyValidity = password => {
    setPassword(password);
    let result = true;
    const errorArray = [];
    /** LOWER CASE CONDITION */
    let regLowerCase = new RegExp('^(?=.*[a-z])');
    if (!regLowerCase.test(password)) {
      errorArray.push(1);
      result = false;
    }

    /** UPPER CASE CONDITION */
    let regUpperCase = new RegExp('^(?=.*[A-Z])');
    if (!regUpperCase.test(password)) {
      errorArray.push(2);
      result = false;
    }

    /** NUMERIC CONDITION */
    let regNumberCase = new RegExp('^(?=.*[0-9])');
    if (!regNumberCase.test(password)) {
      errorArray.push(3);
      result = false;
    }

    /** SPECIAL CONDITION */
    let regSpecialCase = new RegExp('^(?=.*[!@#$%^&])');
    if (!regSpecialCase.test(password)) {
      errorArray.push(4);
      result = false;
    }

    /** LENGTH CONDITION */
    if (password) {
      let regLengthCase = new RegExp('^(?=.{8,})');
      if (!regLengthCase.test(password)) {
        errorArray.push(5);
        result = false;
      }
    } else {
      errorArray.push(5);
      result = false;
    }

    setInvalidPassword(errorArray);
    return result;
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={Splash}
      style={{
        flex: 1,
        justifyContent: 'space-between',
        top: StatusBar.currentHeight - 10,
      }}>
      <AlertOverlay visible={loading} />
      <SuccessResetPasswordModal isVisible={successModal} setVisible={setSuccessModal} goToLogin={goToLogin} />
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Image style={{height: 15, width: 10, margin: 16}} source={ArrowLeft} resizeMode={'contain'} />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', marginTop: 57, marginHorizontal: 90}}>
          {/* <Text>Enter the 6-digit code sent to</Text>
          <Text style={{fontFamily: 'Rubik-Medium'}}>{`+63 ${mobile}`}</Text> */}
          <Image source={ToktokGoIcon} style={{height: 85, width: 100}} resizeMode="contain" />
          <Text style={{fontSize: constants.FONT_SIZE.XL + 1, marginTop: 40}}>Reset Password</Text>
        </View>
        {/*-------------------- PASSWORD --------------------*/}
        {/* <TextInput
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={LIGHT}
        /> */}
        <View style={{marginHorizontal: 57}}>
          <View
            style={[
              styles.textInput,
              {
                borderWidth: onFocusNewPassword || invalidPassword.length > 0 ? 1 : 0,
                borderColor: onFocusNewPassword
                  ? constants.COLOR.ORANGE
                  : invalidPassword.length > 0
                  ? constants.COLOR.RED
                  : '',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 5,
                backgroundColor: constants.COLOR.LIGHT,
                marginTop: 24,
                paddingLeft: 10,
              },
            ]}>
            <TextInput
              // ref={newInputRef}
              // editable={newPasswordEditable}
              style={styles.textInputWithContainer}
              value={password}
              onChangeText={value => passwordVerifyValidity(value)}
              placeholder="Enter New Password"
              secureTextEntry={secureNewPassword}
              autoCapitalize={false}
              onFocus={() => {
                setOnFocusNewPassword(true);
              }}
              onBlur={() => {
                setOnFocusNewPassword(false);
              }}
              onSubmitEditing={() => {
                confirmInputRef.current.focus();
              }}
            />
            <MCIcons
              name={!secureNewPassword ? 'eye' : 'eye-off-outline'}
              size={15}
              style={{paddingRight: 10}}
              color={constants.COLOR.DARK}
              onPress={() => {
                setSecureNewPassword(!secureNewPassword);
              }}
            />
          </View>
          {invalidPassword.length > 0 && (
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                <PasswordValidationIcon errorList={invalidPassword} validation_number={5} />
                <Text style={styles.smallText}>Length must be at least 8 characters</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                <PasswordValidationIcon errorList={invalidPassword} validation_number={1} />
                <Text style={styles.smallText}>Must contain at least 1 lowercase</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                <PasswordValidationIcon errorList={invalidPassword} validation_number={2} />
                <Text style={styles.smallText}>Must contain at least 1 uppercase</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                <PasswordValidationIcon errorList={invalidPassword} validation_number={3} />
                <Text style={styles.smallText}>Must contain at least 1 number</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                <PasswordValidationIcon errorList={invalidPassword} validation_number={4} />
                <Text style={styles.smallText}>Must contain at least 1 special character</Text>
              </View>
            </View>
          )}
          {/*-------------------- REPEAT PASSWORD --------------------*/}
          <View style={{marginBottom: 16}}>
            <View
              style={[
                styles.textInput,
                {
                  borderWidth: onFocusConfirmPassword || !passwordMatch ? 1 : 0,
                  borderColor: onFocusConfirmPassword
                    ? constants.COLOR.ORANGE
                    : !passwordMatch
                    ? constants.COLOR.RED
                    : '',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: constants.COLOR.LIGHT,
                  borderRadius: 5,
                  marginTop: 24,
                  paddingLeft: 10,
                },
              ]}>
              <TextInput
                // ref={confirmInputRef}
                style={styles.textInputWithContainer}
                value={repeatPassword}
                onChangeText={value => setRepeatPassword(value)}
                placeholder="Confirm Password"
                secureTextEntry={secureConfirmPassword}
                autoCapitalize={false}
                // editable={confirmPasswordEditable}
                onFocus={() => {
                  setOnFocusConfirmPassword(true);
                }}
                onBlur={() => {
                  setOnFocusConfirmPassword(false);
                }}
              />
              <MCIcons
                name={!secureConfirmPassword ? 'eye' : 'eye-off-outline'}
                size={15}
                color={constants.COLOR.DARK}
                style={{paddingRight: 10}}
                onPress={() => {
                  setSecureConfirmPassword(!secureConfirmPassword);
                }}
              />
            </View>
            {!passwordMatch && (
              <Text style={{color: constants.COLOR.RED, fontSize: constants.FONT_SIZE.S}}>Passwords do not match</Text>
            )}
          </View>
          {/*---------------------------------------- BUTTON ----------------------------------------*/}

          <TouchableHighlight style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableHighlight>
        </View>

        {/* <TextInput
          value={repeatPassword}
          onChangeText={value => setRepeatPassword(value)}
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={LIGHT}
        /> */}
      </ScrollView>
      {/* <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight> */}
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostRegistration);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    // width: 300,

    alignItems: 'center',
    backgroundColor: constants.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: constants.FONT_FAMILY.BOLD,
    fontSize: constants.FONT_SIZE.L,
    color: constants.COLOR.WHITE,
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  textInputWithContainer: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: constants.FONT_FAMILY.REGULAR,
    fontSize: constants.FONT_SIZE.L,
    color: constants.COLOR.BLACK,
  },
});
