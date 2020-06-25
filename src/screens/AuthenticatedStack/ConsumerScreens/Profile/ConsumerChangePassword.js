import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {useMutation} from '@apollo/react-hooks';

import {PATCH_USER_CHANGE_PASSWORD} from '../../../../graphql';

const ChangePassword = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Change', 'Password']} />,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [patchUserChangePassword, {loading}] = useMutation(PATCH_USER_CHANGE_PASSWORD, {
    variables: {
      input: {
        userId: session.user.id,
        currentPassword,
        newPassword,
      },
    },
    onCompleted: ({patchUserChangePassword}) => {
      navigation.pop();
      Toast.show(patchUserChangePassword);
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
    if (currentPassword == '') {
      Alert.alert('', `Please enter your current password`);
      return;
    }

    if (newPassword == '') {
      Alert.alert('', `Please enter your new password.`);
      return;
    }

    if (repeatPassword == '') {
      Alert.alert('', `Please repeat your password.`);
      return;
    }

    if (newPassword != repeatPassword) {
      Alert.alert('', `Password does not match.`);
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('', `Password must have minimum length of 6 characters.`);
      return;
    }

    if (!validator.isAlphanumeric(newPassword)) {
      Alert.alert('', `Password can only contain letters and numbers.`);
      return;
    }

    patchUserChangePassword();
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*-------------------- CURRENT PASSWORD --------------------*/}
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          value={currentPassword}
          onChangeText={value => setCurrentPassword(value)}
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
        />

        {/*-------------------- NEW PASSWORD --------------------*/}
        <Text style={styles.label}>New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={value => setNewPassword(value)}
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
        />

        {/*-------------------- REPEAT PASSWORD --------------------*/}
        <Text style={styles.label}>Repeat Password</Text>
        <TextInput
          value={repeatPassword}
          onChangeText={value => setRepeatPassword(value)}
          style={styles.input}
          placeholder="Repeat Password"
          secureTextEntry
        />
      </ScrollView>
      {/*-------------------- CONFIRM BUTTON --------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
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
)(ChangePassword);

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
