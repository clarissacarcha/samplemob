import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, View, Platform, Image} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../../components';
import CONSTANTS from '../../../../common/res/constants';
// import { IncorrectPasswordModal } from './components/IncorrectPasswordModal';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
// import {AlertOverlay} from '../../../../components';
import {APP_FLAVOR} from '../../../../res/constants';
import {getUniqueId} from 'react-native-device-info';
import {AUTH_CLIENT, VERIFY_LOGIN} from '../../../../graphql';
import TokGoIcon from '../../../../assets/images/ToktokGoIcon.png';
import {useMutation} from '@apollo/react-hooks';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { onErrorAlert} from '../../../../util/ErrorUtility';
// import {useAlert} from '../../../../hooks/useAlert';
import {connect} from 'react-redux';
import {Header} from './Components';
import ShowPassword from '../../../../assets/icons/ShowPassword.png';
import HidePassword from '../../../../assets/icons/HidePassword.png';
import constants from '../../../../common/res/constants';

const EnterPassword = ({navigation, route, session}) => {
  const {userName} = route.params;
  const currentInputRef = useRef();
  // const newInputRef = useRef();
  // const confirmInputRef = useRef();

  const [currentPassword, setCurrentPassword] = useState('');
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [onFocusCurrentPassword, setOnFocusCurrentPassword] = useState(false);
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
  const [errorPassModalVissible, setErrorPassModalVissible] = useState(false);

  const onSubmit = () => {
    if (!currentPassword) {
      Alert.alert('', 'Please enter your password to continue.');
      return;
    }

    verifyLogin();
  };

  const [verifyLogin, {loading}] = useMutation(VERIFY_LOGIN, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: userName,
        password: currentPassword,
        appFlavor: APP_FLAVOR,
        deviceId: getUniqueId(),
        deviceType: Platform.select({ios: 'I', android: 'A'}),
      },
    },
    onError: error => {
      try {
        const {graphQLErrors, networkError} = error;
        console.log(error);
        if (networkError) {
          alert({message: 'Network error occurred. Please check your internet connection.'});
        } else if (graphQLErrors.length > 0) {
          graphQLErrors.map(({message, locations, path, code}) => {
            if (code === 'INTERNAL_SERVER_ERROR') {
              alert({message: 'Something went wrong.'});
            } else if (code === 'USER_INPUT_ERROR') {
              alert({message});
            } else if (code === 'BAD_USER_INPUT') {
              //   alert({message});
              setErrorPassModalVissible(true);
              setInvalidCurrentPassword(true);
            } else if (code === 'AUTHENTICATION_ERROR') {
              // Do Nothing. Error handling should be done on the scren
            } else {
              alert({message: 'Something went wrong...'});
            }
          });
        }
      } catch (err) {
        console.log('ON ERROR ALERT: ', err);
      }
    },

    onCompleted: data => {
      const currentPass = currentPassword;
      setCurrentPassword('');
      setInvalidCurrentPassword(false);
      navigation.push('ConsumerChangePassword', {currentPass});
    },
  });

  // const toggleErrorModal = () => {
  //     setErrorPassModalVissible(!errorPassModalVissible)
  // }

  const handleValue = value => {
    setCurrentPassword(value);
    if (!value) {
      setInvalidCurrentPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Change Password'} navigation={navigation} />
      {/* <AlertOverlay visible={loading} />
            {errorPassModalVissible && <IncorrectPasswordModal toggleErrorModal={toggleErrorModal}/>} */}
      <View style={{alignItems: 'center', paddingTop: 50}}>
        <Image source={TokGoIcon} style={{width: 73, height: 87, marginBottom: 30}} />
        <Text style={styles.header}>Enter Current Password</Text>
        <View style={{marginVertical: 24}}>
          <View
            style={[
              styles.textInput,
              {
                borderWidth: onFocusCurrentPassword || invalidCurrentPassword ? 1 : 0,
                borderColor: onFocusCurrentPassword
                  ? CONSTANTS.COLOR.ORANGE
                  : invalidCurrentPassword
                  ? CONSTANTS.COLOR.RED
                  : '',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <TextInput
              ref={currentInputRef}
              style={styles.textInputWithContainer}
              value={currentPassword}
              onChangeText={value => handleValue(value)}
              placeholder="Enter Current Password"
              placeholderTextColor={constants.COLOR.DARK}
              secureTextEntry={secureNewPassword}
              autoCapitalize="none"
              onFocus={() => {
                setOnFocusCurrentPassword(true);
              }}
              onBlur={() => {
                setOnFocusCurrentPassword(false);
              }}
              // onSubmitEditing={() => {
              //     newInputRef.current.focus();
              // }}
            />
            <TouchableOpacity onPress={() => setSecureNewPassword(!secureNewPassword)}>
              <Image source={!secureNewPassword ? ShowPassword : HidePassword} style={styles.showPassword} />
            </TouchableOpacity>
          </View>
          {invalidCurrentPassword && (
            <Text style={{color: CONSTANTS.COLOR.RED, fontSize: CONSTANTS.FONT_SIZE.S}}>Password is incorrect</Text>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSubmit();
            }}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  header: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: '#000000',
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
  showPassword: {
    height: 17,
    width: 17,
  },
});

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterPassword);
