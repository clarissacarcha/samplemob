import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert, Image} from 'react-native';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {AlertOverlay, BottomTabHeader, HeaderTitle, HeaderBack} from '../../../../components';
import {onError} from '../../../../util/ErrorUtility';
import {PATCH_PERSON_POST_REGISTRATION} from '../../../../graphql';

import FAIcon from 'react-native-vector-icons/FontAwesome';

const DriverProfile = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Profile', '']} />,
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
    onError: onError,
    onCompleted: ({patchPersonPostRegistration}) => {
      const newSession = {...session};
      newSession.user.person.firstName = firstName;
      newSession.user.person.lastName = lastName;
      newSession.user.person.emailAddress = emailAddress;
      createSession(newSession);

      Toast.show('Profile successfully updated.');
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

    patchPersonPostRegistration();
  };

  const onProfilePress = () => {
    const label = ['Change', 'Profile Picture'];
    navigation.push('ChangeProfilePicture', {label});
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*---------------------------------------- FORM ----------------------------------------*/}
        <View style={{marginTop: 20, alignItems: 'center'}}>
          {/*--------------- AVATAR ---------------*/}
          {session.user.person.avatar ? (
            <TouchableHighlight onPress={onProfilePress} underlayColor={COLOR} style={{borderRadius: 10}}>
              <View
                style={{
                  height: 120,
                  width: 120,
                  backgroundColor: MEDIUM,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <Image
                  source={{uri: session.user.person.avatarThumbnail}}
                  resizeMode={'cover'}
                  style={{width: 120, height: 120, borderRadius: 10}}
                />
                <FAIcon name="edit" size={20} color={LIGHT} style={{position: 'absolute', bottom: 5, right: 5}} />
              </View>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight onPress={onProfilePress} underlayColor={COLOR} style={{borderRadius: 10}}>
              <View
                style={{
                  height: 120,
                  width: 120,
                  backgroundColor: MEDIUM,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <FAIcon name="user" size={90} color={LIGHT} />
                <FAIcon name="edit" size={20} color={LIGHT} style={{position: 'absolute', bottom: 5, right: 5}} />
              </View>
            </TouchableHighlight>
          )}
        </View>
        {/*---------------------------------------- BUTTON ----------------------------------------*/}
        <TouchableHighlight
          onPress={() => navigation.navigate('ConsumerChangePassword')}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Change Password</Text>
          </View>
        </TouchableHighlight>

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {session.user.username}
        </Text>

        <Text style={styles.label}>First Name</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>{firstName}</Text>

        <Text style={styles.label}>Middle Name</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {session.user.person.middleName}
        </Text>

        <Text style={styles.label}>Last Name</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>{lastName}</Text>

        <Text style={styles.label}>Email Address</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {session.user.person.emailAddress}
        </Text>

        <Text style={styles.label}>Birthdate</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {moment.unix(session.user.person.birthdate / 1000).format('MMM DD YYYY')}
        </Text>

        <Text style={styles.label}>Gender</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {session.user.person.gender == 1 ? 'Male' : 'Female'}
        </Text>

        <View style={{height: 20}} />

        {/* <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={emailAddress}
          onChangeText={value => setEmailAddress(value)}
          style={styles.input}
          placeholder="Email Address"
        /> */}
      </ScrollView>
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
)(DriverProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
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
    marginBottom: 0,
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
