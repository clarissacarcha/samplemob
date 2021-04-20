import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import {useMutation} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import QRCode from 'react-native-qrcode-svg';
import {
  COLOR,
  DARK,
  MAP_DELTA_LOW,
  FONT_SIZE,
  LIGHT,
  MEDIUM,
  FONT_MEDIUM,
  FONT_REGULAR,
} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
// import {BlackButton} from '../../../../components/ui';
import {BlackButton} from '../../../../revamp';
import {useAlert} from '../../../../hooks/useAlert';
import {onError, onErrorAlert} from '../../../../util/ErrorUtility';
import {PATCH_PERSON_POST_REGISTRATION} from '../../../../graphql';

const ImageWidth = (Dimensions.get('window').width - 40) / 2;

import FAIcon from 'react-native-vector-icons/FontAwesome';
import ToktokWashed from '../../../../assets/images/ToktokWashed.png';

const ConsumerProfile = ({navigation, constants, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['My', 'Profile']} />,
  });

  const alert = useAlert();
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
    onError: (error) => {
      onErrorAlert({alert, error});
    },
    onCompleted: ({res}) => {
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
      Alert.alert('', 'Please enter your first name.');
      return;
    }

    if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter your last name.');
      return;
    }

    if (validator.isEmpty(emailAddress, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter your email address.');
      return;
    }

    if (!validator.isEmail(emailAddress)) {
      Alert.alert('', 'Please enter a valid email address.');
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
      <InputScrollView showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', marginHorizontal: 10, justifyContent: 'space-between'}}>
          {/*--------------- AVATAR ---------------*/}
          <View style={{marginTop: 20, alignItems: 'center'}}>
            {`${constants.awsS3BaseUrl}${constants.defaultAvatar}` != session.user.person.avatar ? (
              <TouchableHighlight onPress={onProfilePress} underlayColor={COLOR} style={{borderRadius: 10}}>
                <View
                  style={{
                    height: ImageWidth,
                    width: ImageWidth,
                    backgroundColor: MEDIUM,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <Image
                    source={{uri: session.user.person.avatarThumbnail}}
                    resizeMode={'cover'}
                    style={{width: ImageWidth, height: ImageWidth, borderRadius: 10}}
                  />
                  <FAIcon name="edit" size={20} color={LIGHT} style={{position: 'absolute', bottom: 5, right: 5}} />
                </View>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight onPress={onProfilePress} underlayColor={COLOR} style={{borderRadius: 10}}>
                <View
                  style={{
                    height: ImageWidth,
                    width: ImageWidth,
                    backgroundColor: '#333',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <Image
                    source={ToktokWashed}
                    resizeMode={'contain'}
                    tintColor={MEDIUM}
                    style={{width: 80, height: 80, borderRadius: 10}}
                  />
                  <FAIcon name="edit" size={20} color={LIGHT} style={{position: 'absolute', bottom: 5, right: 5}} />
                </View>
              </TouchableHighlight>
            )}
          </View>

          {/*-------------------- QR CODE --------------------*/}
          <View style={{marginTop: 20}}>
            <View style={{alignItems: 'center'}}>
              <QRCode
                value={session.user.userId} //Give value when there's no session as it will throw an error if value is empty.
                size={ImageWidth}
                color={DARK}
                backgroundColor="transparent"
                // onPress={() => alert('Pressed')}
              />
            </View>
          </View>
        </View>

        {/*-------------------- MOBILE NUMBER --------------------*/}
        <Text style={styles.label}>Mobile Number</Text>
        <View style={[styles.input, {justifyContent: 'center'}]}>
          <Text style={{color: MEDIUM}}>{session.user.username}</Text>
        </View>

        {/*-------------------- FIRST NAME --------------------*/}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={(value) => setFirstName(value)}
          style={styles.input}
          placeholder="First Name"
        />

        {/*-------------------- LAST NAME --------------------*/}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={(value) => setLastName(value)}
          style={styles.input}
          placeholder="Last Name"
        />

        {/*-------------------- EMAIL --------------------*/}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={emailAddress}
          onChangeText={(value) => setEmailAddress(value)}
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          caretHidden
        />

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
              onChangeText={(value) => setReferralCode(value)}
              style={styles.input}
              placeholder="Referral Code"
            />
          </View>
        )}

        {/*-------------------- REFERRAL Name --------------------*/}
        {session.user.consumer.referralName && (
          <View>
            <Text style={styles.label}>Referral Name</Text>
            <View style={[styles.input, {justifyContent: 'center'}]}>
              <Text style={{color: MEDIUM}}>{session.user.consumer.referralName}</Text>
            </View>
          </View>
        )}

        {/*-------------------- UPDATE BUTTON --------------------*/}
        <BlackButton
          onPress={onSubmit}
          label="Update Profile"
          style={{height: 40}}
          touchableStyle={{marginHorizontal: 10, marginTop: 20}}
        />

        {/*-------------------- CHANGE PASSWORD BUTTON --------------------*/}
        <BlackButton
          onPress={() => navigation.push('ConsumerChangePassword')}
          label="Change Password"
          touchableStyle={{marginHorizontal: 10, marginTop: 20, marginBottom: 10}}
        />
      </InputScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerProfile);

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
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 10,
    height: 50,
    color: DARK,
    fontFamily: FONT_REGULAR,
    fontSize: FONT_SIZE.M,
  },
  label: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: FONT_MEDIUM,
    fontSize: FONT_SIZE.M,
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
