import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import {useMutation} from '@apollo/react-hooks';
import {DARK, MAP_DELTA_LOW, LIGHT, ORANGE, MEDIUM} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../res/variables';
import {YellowButton} from '../../../../revamp';
import {onError} from '../../../../util/ErrorUtility';
import {PATCH_USER_CHANGE_PASSWORD} from '../../../../graphql';
import CONSTANTS from '../../../../common/res/constants';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import EIcons from 'react-native-vector-icons/AntDesign';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TokGoIcon from '../../../../assets/images/ToktokGoIcon.png';
import {ChangePasswordSuccessModal} from './ChangePasswordSucessModal';
import {ChangePasswordConfirmationModal} from './ChangePasswordConfirmationModal';
import {Header} from './Components';
import ShowPassword from '../../../../assets/icons/ShowPassword.png';
import HidePassword from '../../../../assets/icons/HidePassword.png';

const PasswordValidationIcon = ({errorList, validation_number}) => {
  return errorList.includes(validation_number) ? (
    <AntIcons name={'closecircle'} color={CONSTANTS.COLOR.RED} size={11} style={{marginHorizontal: 8}} />
  ) : (
    <EIcons name={'checkcircle'} color={CONSTANTS.COLOR.GREEN} size={11} style={{marginHorizontal: 8}} />
  );
};

const ChangePassword = ({navigation, session, route}) => {
  const {currentPass} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Change password', '']} />,
  });

  const newInputRef = useRef();
  const confirmInputRef = useRef();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const [onFocusCurrentPassword, setOnFocusCurrentPassword] = useState(false);
  const [onFocusNewPassword, setOnFocusNewPassword] = useState(false);
  const [onFocusConfirmPassword, setOnFocusConfirmPassword] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [invalidPassword, setInvalidPassword] = useState([]);
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);

  const [showConfirmationChangePassword, setConfirmationChangePassword] = useState(false);
  const [successfulChangePassword, setSuccessfulChangePassword] = useState(false);

  const [newPasswordEditable, setNewPasswordEditable] = useState(false);
  const [confirmPasswordEditable, setConfirmPasswordEditable] = useState(false);
  const [validation, setValidation] = useState(true);

  const [patchUserChangePassword, {loading}] = useMutation(PATCH_USER_CHANGE_PASSWORD, {
    variables: {
      input: {
        userId: session.user.id,
        currentPassword: currentPass,
        newPassword,
      },
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            if (message == 'Invalid current password.') {
              setInvalidCurrentPassword(true);
            }
            Alert.alert('', message);
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: ({patchUserChangePassword}) => {
      console.log('DONE');
      setSuccessfulChangePassword(true);
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  const passwordVerifyValidity = password => {
    setNewPassword(password);
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
    console.log(validation);
    return result;
  };

  const onSavePasswordPress = () => {
    if (passwordVerifyValidity(newPassword) && passwordMatch) {
      setConfirmationChangePassword(true);
    }
    console.log(invalidPassword);
  };

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [confirmPassword, newPassword]);

  useEffect(() => {
    if (currentPass != '') {
      setNewPasswordEditable(true);
    }
    if (newPassword != '') {
      setConfirmPasswordEditable(true);
    }
  }, [currentPass, newPassword]);

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Header navigation={navigation} />

      <AlertOverlay visible={loading} />
      <ChangePasswordSuccessModal
        navigation={navigation}
        successfulChangePassword={successfulChangePassword}
        setSuccessfulChangePassword={setSuccessfulChangePassword}
      />
      <ChangePasswordConfirmationModal
        navigation={navigation}
        showConfirmationChangePassword={showConfirmationChangePassword}
        setConfirmationChangePassword={setConfirmationChangePassword}
        patchUserChangePassword={patchUserChangePassword}
      />
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Image source={TokGoIcon} style={{width: 73, height: 87, marginBottom: 30}} />
          <Text style={styles.header}>Setup New Password</Text>
          <View style={{marginBottom: 16}}>
            <View
              style={[
                styles.textInput,
                {
                  borderWidth: onFocusNewPassword || invalidPassword.length > 0 ? 1 : 0,
                  borderColor: onFocusNewPassword
                    ? CONSTANTS.COLOR.ORANGE
                    : invalidPassword.length > 0
                    ? CONSTANTS.COLOR.RED
                    : '',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              <TextInput
                ref={newInputRef}
                editable={newPasswordEditable}
                style={styles.textInputWithContainer}
                value={newPassword}
                onChangeText={password => passwordVerifyValidity(password)}
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
              <TouchableOpacity onPress={() => setSecureNewPassword(!secureNewPassword)}>
                <Image source={!secureNewPassword ? ShowPassword : HidePassword} style={styles.showPassword} />
              </TouchableOpacity>
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
          </View>
          <View style={{marginBottom: 16}}>
            <View
              style={[
                styles.textInput,
                {
                  borderWidth: onFocusConfirmPassword || !passwordMatch ? 1 : 0,
                  borderColor: onFocusConfirmPassword
                    ? CONSTANTS.COLOR.ORANGE
                    : !passwordMatch
                    ? CONSTANTS.COLOR.RED
                    : '',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              <TextInput
                ref={confirmInputRef}
                style={styles.textInputWithContainer}
                value={confirmPassword}
                onChangeText={value => {
                  setConfirmPassword(value);
                }}
                placeholder="Confirm Password"
                secureTextEntry={secureConfirmPassword}
                autoCapitalize={false}
                editable={confirmPasswordEditable}
                onFocus={() => {
                  setOnFocusConfirmPassword(true);
                }}
                onBlur={() => {
                  setOnFocusConfirmPassword(false);
                }}
              />

              <TouchableOpacity onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}>
                <Image source={!secureConfirmPassword ? ShowPassword : HidePassword} style={styles.showPassword} />
              </TouchableOpacity>
            </View>
            {!passwordMatch && (
              <Text style={{color: CONSTANTS.COLOR.RED, fontSize: CONSTANTS.FONT_SIZE.S}}>Passwords do not match</Text>
            )}
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSavePasswordPress();
            }}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  header: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.BLACK,
    marginBottom: 16,
  },
  showPassword: {
    height: 17,
    width: 17,
  },
  textInput: {
    width: 300,
    backgroundColor: CONSTANTS.COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 16,
  },
  textInputWithContainer: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.L,
    color: CONSTANTS.COLOR.BLACK,
  },
  button: {
    width: 300,
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.L,
    color: CONSTANTS.COLOR.WHITE,
  },
  smallText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.DARK,
  },
});
