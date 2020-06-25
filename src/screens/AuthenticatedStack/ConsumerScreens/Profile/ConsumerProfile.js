import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {useMutation} from '@apollo/react-hooks';

import {PATCH_PERSON_POST_REGISTRATION} from '../../../../graphql';

const ConsumerProfile = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['My', 'Profile']} />,
  });

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
      },
    },
    onCompleted: ({patchPersonPostRegistration}) => {
      const newSession = {...session};
      newSession.user.person.firstName = firstName;
      newSession.user.person.lastName = lastName;
      newSession.user.person.emailAddress = emailAddress;
      createSession(newSession);

      Toast.show('Profile successfully updated.');
    },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const onSubmit = () => {
    if (firstName == '') {
      Alert.alert('', `Please enter your first name`);
      return;
    }

    if (lastName == '') {
      Alert.alert('', `Please enter your last name.`);
      return;
    }

    if (emailAddress == '') {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*-------------------- MOBILE NUMBER --------------------*/}

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          +63{session.user.username}
        </Text>

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
      </ScrollView>
      {/*-------------------- UPDATE BUTTON --------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Update Profile</Text>
        </View>
      </TouchableHighlight>

      {/*-------------------- UPDATE BUTTON --------------------*/}
      <TouchableHighlight
        onPress={() => navigation.push('ConsumerChangePassword')}
        underlayColor={COLOR}
        style={[styles.submitBox, {marginTop: 0}]}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Change Password</Text>
        </View>
      </TouchableHighlight>
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
