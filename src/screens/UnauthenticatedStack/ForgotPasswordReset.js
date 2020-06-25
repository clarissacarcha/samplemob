import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import {COLOR, DARK, MEDIUM} from '../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../components';
import {useMutation} from '@apollo/react-hooks';
import {onError} from '../../util/ErrorUtility';

import {FORGOT_PASSWORD_RESET} from '../../graphql';

const PostRegistration = ({navigation, route}) => {
  const goToLogin = () => {
    navigation.navigate('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={goToLogin} />,
    headerTitle: () => <HeaderTitle label={['Reset', 'Password']} />,
  });

  const {mobile, verificationCode} = route.params;
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [forgotPasswordReset, {loading}] = useMutation(FORGOT_PASSWORD_RESET, {
    variables: {
      input: {
        mobile,
        verificationCode,
        password,
      },
    },
    onError: onError,
    onCompleted: ({forgotPasswordReset}) => {
      Alert.alert('', forgotPasswordReset, [
        {
          title: 'Ok',
          onPress: goToLogin,
        },
      ]);
    },
  });

  const onSubmit = () => {
    if (password == '') {
      Alert.alert('', `Please enter your password.`);
      return;
    }

    if (repeatPassword == '') {
      Alert.alert('', `Please repeat your password.`);
      return;
    }

    if (password != repeatPassword) {
      Alert.alert('', `Password does not match.`);
      return;
    }

    if (password.length < 6) {
      Alert.alert('', `Password must have minimum length of 6 characters.`);
      return;
    }

    if (!validator.isAlphanumeric(password)) {
      Alert.alert('', `Password can only contain letters and numbers.`);
      return;
    }

    forgotPasswordReset();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
      goToLogin();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*-------------------- PASSWORD --------------------*/}
        <Text style={styles.label}>New Password</Text>
        <TextInput
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={true}
          autoCapitalize="none"
        />

        {/*-------------------- REPEAT PASSWORD --------------------*/}
        <Text style={styles.label}>Repeat Password</Text>
        <TextInput
          value={repeatPassword}
          onChangeText={value => setRepeatPassword(value)}
          style={styles.input}
          placeholder="Repeat Password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </ScrollView>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
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
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostRegistration);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
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
    fontWeight: 'bold',
  },
});
