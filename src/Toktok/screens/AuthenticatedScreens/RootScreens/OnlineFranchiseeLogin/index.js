import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Image, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import CheckBox from 'react-native-check-box';
import {useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {connect} from 'react-redux';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {POST_FRANCHISEE_VERIFICATION} from '../../../../../graphql';
import {onErrorAlert} from '../../../../../util/ErrorUtility';

import ToktokSuperApp from '../../../../../assets/images/ToktokSuperApp.png';

const Screen = ({navigation, createSession, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['', '']} />,
  });

  const alert = useAlert();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    if (username && password && agree) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [username, password, agree]);

  const [postFranchiseeVerification, {loading}] = useMutation(POST_FRANCHISEE_VERIFICATION, {
    onError: error => {
      onErrorAlert({alert, error});
    },
    onCompleted: data => {
      const {
        referralCode,
        referralName,
        franchiseeCode,
        franchiseeFirstName,
        franchiseLastName,
        franchiseeAccountType,
      } = data.postFranchiseeVerification.consumer;

      const newSession = {...session};
      newSession.user.consumer.referralCode = referralCode;
      newSession.user.consumer.referralName = referralName;
      newSession.user.consumer.franchiseeCode = franchiseeCode;
      newSession.user.consumer.franchiseeFirstName = franchiseeFirstName;
      newSession.user.consumer.franchiseLastName = franchiseLastName;
      newSession.user.consumer.franchiseeAccountType = franchiseeAccountType;
      createSession(newSession);

      Alert.alert('', data.postFranchiseeVerification.message, [
        {
          text: 'OK',
          onPress: () => {
            navigation.pop();
          },
        },
      ]);
    },
  });

  const onSubmit = () => {
    postFranchiseeVerification({
      variables: {
        input: {
          username,
          password,
        },
      },
    });
  };

  return (
    <View style={styles.box}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}} />
      <View style={styles.imageBox}>
        <Image source={ToktokSuperApp} style={styles.image} resizeMode="contain" />
      </View>
      <TextInput
        value={username}
        onChangeText={value => setUsername(value)}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={'#D3D3D3'}
        returnKeyType="done"
      />
      <TextInput
        value={password}
        onChangeText={value => setPassword(value)}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'#D3D3D3'}
        secureTextEntry
        returnKeyType="done"
      />
      <TouchableHighlight
        onPress={onSubmit}
        style={[styles.blackButton]}
        underlayColor={COLOR.YELLOW_UNDERLAY}
        disabled={!isButtonEnabled}>
        <View style={[styles.blackButtonBox]}>
          <Text style={styles.label}>Link toktok franchisee account</Text>
        </View>
      </TouchableHighlight>

      <View style={{marginTop: 20, marginHorizontal: 50, flexDirection: 'row', alignItems: 'center'}}>
        {/* <CheckBox
          disabled={false}
          value={agree}
          onValueChange={newValue => setAgree(newValue)}
          boxType="square"
          style={{marginRight: 8}}
        /> */}

        <CheckBox
          style={{marginRight: 8}}
          onClick={() => {
            setAgree(!agree);
          }}
          isChecked={agree}
          checkBoxColor={COLOR.ORANGE}
        />
        <View style={{flex: 1}}>
          <Text>
            By linking your franchisee account, you accept the{' '}
            <Text style={{color: COLOR.ORANGE}}>Terms and Conditions</Text>
          </Text>
        </View>
      </View>
      <View style={{flex: 3}} />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const OnlineFranchiseeLogin = connect(mapStateToProps, mapDispatchToProps)(Screen);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageBox: {
    alignItems: 'center',
    marginBottom: 50,
  },
  input: {
    marginHorizontal: 50,
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7FA',
    marginBottom: 20,
  },
  blackButton: {
    borderRadius: 5,
    marginHorizontal: 50,
  },
  blackButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLOR.ORANGE,
    borderRadius: 5,
  },
  label: {
    color: COLOR.LIGHT,
    paddingHorizontal: 10,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  image: {
    height: 150,
    width: 150,
  },
});
