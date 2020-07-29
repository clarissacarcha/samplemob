import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import {useMutation} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {BlackButton} from '../../../../components/ui';
import {onError} from '../../../../util/ErrorUtility';
import {PATCH_PERSON_POST_REGISTRATION} from '../../../../graphql';

const ConsumerProfile = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['My', 'Profile']} />,
  });

  const [referralCode, setReferralCode] = useState(session.user.consumer.referralCode);
  const [firstName, setFirstName] = useState(session.user.person.firstName);
  const [lastName, setLastName] = useState(session.user.person.lastName);
  const [emailAddress, setEmailAddress] = useState(session.user.person.emailAddress);

  const [patchPersonPostRegistration, {loading}] = useMutation(PATCH_PERSON_POST_REGISTRATION, {
    variables: {
      input: {
        tokUserId: session.user.id,
        firstName,
        lastName,
        emailAddress,
        referralCode,
      },
    },
    onError: onError,
    onCompleted: ({patchPersonPostRegistration}) => {
      const newSession = {...session};
      newSession.user.person.firstName = firstName;
      newSession.user.person.lastName = lastName;
      newSession.user.person.emailAddress = emailAddress;
      newSession.user.consumer.referralCode = referralCode;
      createSession(newSession);

      Toast.show('Profile successfully updated.');
    },
  });

  const onSubmit = () => {
    if (validator.isEmpty(firstName, {ignore_whitespace: true})) {
      Alert.alert('', `Please enter your first name.`);
      return;
    }

    if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
      Alert.alert('', `Please enter your last name.`);
      return;
    }

    if (validator.isEmpty(emailAddress, {ignore_whitespace: true})) {
      Alert.alert('', `Please enter your email address.`);
      return;
    }

    if (!validator.isEmail(emailAddress)) {
      Alert.alert('', `Please enter a valid email address.`);
      return;
    }

    patchPersonPostRegistration();
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <InputScrollView showsVerticalScrollIndicator={false}>
        {/*-------------------- REFERRAL CODE --------------------*/}
        {session.user.consumer.referralCode ? (
          <View>
            <Text style={styles.label}>Referral Code</Text>
            <View style={[styles.input, {justifyContent: 'center'}]}>
              <Text style={{color: MEDIUM}}>{referralCode}</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Referral Code</Text>
            <TextInput
              value={referralCode}
              onChangeText={value => setReferralCode(value)}
              style={styles.input}
              placeholder="Referral Code"
            />
          </View>
        )}

        {/*-------------------- MOBILE NUMBER --------------------*/}
        <Text style={styles.label}>Mobile Number</Text>
        <View style={[styles.input, {justifyContent: 'center'}]}>
          <Text style={{color: MEDIUM}}>{session.user.username}</Text>
        </View>

        {/*-------------------- FIRST NAME --------------------*/}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={value => setFirstName(value)}
          style={styles.input}
          placeholder="First Name"
        />

        {/*-------------------- LAST NAME --------------------*/}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={value => setLastName(value)}
          style={styles.input}
          placeholder="Last Name"
        />

        {/*-------------------- EMAIL --------------------*/}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={emailAddress}
          onChangeText={value => setEmailAddress(value)}
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/*-------------------- UPDATE BUTTON --------------------*/}
        <BlackButton onPress={onSubmit} label="Update Profile" containerStyle={{marginBottom: 0, marginTop: 40}} />

        {/*-------------------- CHANGE PASSWORD BUTTON --------------------*/}
        <BlackButton onPress={() => navigation.push('ConsumerChangePassword')} label="Change Password" />
      </InputScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsumerProfile);

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
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
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
});
