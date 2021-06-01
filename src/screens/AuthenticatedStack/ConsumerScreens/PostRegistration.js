import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import {useMutation} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT} from '../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import {onError, onErrorAlert} from '../../../util/ErrorUtility';
import {CLIENT, PATCH_PERSON_POST_REGISTRATION, GET_USER_SESSION, AUTH_CLIENT} from '../../../graphql';
import {useAlert} from '../../../hooks/useAlert';

const PostRegistration = ({navigation, route, session, createSession, destroySession}) => {
  const signOut = () => {
    destroySession();
    navigation.replace('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={signOut} />,
    headerTitle: () => <HeaderTitle label={['Post', 'Registration']} />,
  });

  const alert = useAlert();

  const [referralCode, setReferralCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [patchPersonPostRegistration, {loading}] = useMutation(PATCH_PERSON_POST_REGISTRATION, {
    onError: (error) => {
      onErrorAlert({alert, error});
    },
    onCompleted: () => {
      const newSession = {...session};
      newSession.user.person.firstName = firstName;
      newSession.user.person.lastName = lastName;
      newSession.user.person.emailAddress = emailAddress;
      newSession.user.consumer.referralCode = referralCode;
      createSession(newSession);
      navigation.replace('ConsumerLanding');
    },
  });

  const onSubmit = () => {
    if (validator.isEmpty(firstName, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter your first name');
      return;
    }

    if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter your last name.');
      return;
    }

    if (emailAddress === '') {
      Alert.alert('', 'Please enter your email address.');
      return;
    }

    if (!validator.isEmail(emailAddress)) {
      Alert.alert('', 'Please enter a valid email address.');
      return;
    }

    if (password === '') {
      Alert.alert('', 'Please enter your password.');
      return;
    }

    if (repeatPassword === '') {
      Alert.alert('', 'Please repeat your password.');
      return;
    }

    if (password !== repeatPassword) {
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

    patchPersonPostRegistration({
      variables: {
        input: {
          tokUserId: session.user.id,
          referralCode,
          firstName,
          lastName,
          emailAddress,
          password,
        },
      },
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      signOut();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <InputScrollView showsVerticalScrollIndicator={false} keyboardOffset={50}>
        {/*---------------------------------------- FORM ----------------------------------------*/}
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>Referral Code</Text>
          <Text style={[styles.label, {color: LIGHT, marginLeft: 5}]}>(Optional)</Text>
        </View>
        <TextInput
          value={referralCode}
          onChangeText={(value) => setReferralCode(value)}
          style={styles.input}
          placeholder="Referral Code"
          placeholderTextColor={LIGHT}
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={(value) => setFirstName(value)}
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={LIGHT}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={(value) => setLastName(value)}
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor={LIGHT}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={emailAddress}
          onChangeText={(value) => setEmailAddress(value)}
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={LIGHT}
          caretHidden
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(value) => setPassword(value)}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={LIGHT}
        />

        <Text style={styles.label}>Repeat Password</Text>
        <TextInput
          value={repeatPassword}
          onChangeText={(value) => setRepeatPassword(value)}
          style={styles.input}
          placeholder="Repeat Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={LIGHT}
        />

        {/*---------------------------------------- BUTTON ----------------------------------------*/}
        <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
          </View>
        </TouchableHighlight>
      </InputScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostRegistration);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  addressBox: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    borderRadius: 10,
    alignItems: 'center',
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
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
  label: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
