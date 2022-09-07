import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {HeaderBack, HeaderTitleRevamp, CheckIdleState, OrangeButton, CustomTextInput} from 'toktokwallet/components';
import {contact_us} from 'toktokwallet/assets';
import {moderateScale} from 'toktokwallet/helper';
import {useThrottle} from 'src/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_SEND_MESSAGE} from 'toktokwallet/graphql';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, usePrompt} from 'src/hooks';
import {useMutation} from '@apollo/react-hooks';
import {AlertOverlay} from 'src/components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;

const ItemList = ({logo, label, url, style}) => {
  const openUrl = () => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity onPress={openUrl} style={[styles.itemList, style]}>
      <Image
        style={{
          height: moderateScale(15),
          width: moderateScale(15),
          tintColor: '#F6841F',
        }}
        resizeMode="contain"
        source={logo}
      />
      <Text
        style={{
          fontFamily: FONT.REGULAR,
          fontSize: moderateScale(FONT_SIZE.M),
          marginLeft: moderateScale(7),
          color: '#525252',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const ToktokWalletHelpCentreContactUs = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Contact Us'} />,
  });

  const [message, setMessage] = useState({error: '', value: ''});
  const [subject, setSubject] = useState({error: '', value: ''});
  const alert = useAlert();
  const prompt = usePrompt();

  const [postSendMessage, {loading}] = useMutation(POST_SEND_MESSAGE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => onErrorAlert({alert, error}),
    onCompleted: () => {
      prompt({
        type: 'success',
        title: 'Inquiries Submitted',
        message:
          'Your question or concern is successfully submitted. Please wait for our team to get back to you soon.',
        event: 'TOKTOKBILLSLOAD',
        onPress: () => {
          onChangeSubject('value', '');
          onChangeMessage('value', '');
        },
      });
    },
  });

  const onChangeSubject = (key, value) => {
    setSubject(oldState => ({...oldState, error: '', [key]: value.replace(/^\s+/, '')}));
  };

  const onChangeMessage = (key, value) => {
    setMessage(oldState => ({...oldState, error: '', [key]: value.replace(/^\s+/, '')}));
  };

  const sendEmail = () => {
    const isValidSubject = subject.value.length === 0 ? onChangeSubject('error', 'This is a required field') : '';
    const isValidMessage = message.value.length === 0 ? onChangeMessage('error', 'This is a required field') : '';

    if (!isValidSubject && !isValidMessage) {
      postSendMessage({
        variables: {
          input: {
            subject: subject.value,
            message: message.value,
          },
        },
      });
    }
  };

  const onThrottledPress = useThrottle(sendEmail, 2000);

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'position' : null}>
        <ScrollView style={styles.body}>
          <View style={styles.content}>
            <Text style={styles.title}>How can we help you?</Text>
            <Text
              style={{
                paddingHorizontal: 15,
                fontSize: FONT_SIZE.S + 1,
                fontFamily: FONT.REGULAR,
                textAlign: 'center',
              }}>
              Toktokwallet Team provides only the best service experience to our customers. Should you have any
              questions and concerns, you may reach us through the following details:
            </Text>
          </View>
          <View style={styles.contact}>
            <ItemList
              style={{paddingHorizontal: 10}}
              url="tel:(623) 8424 8617"
              logo={contact_us.phone}
              label="(632) 8424 8617"
            />
            <ItemList
              style={{paddingHorizontal: 10}}
              url="mailto:support@toktokwallet.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?"
              logo={contact_us.email}
              label="support@toktokwallet.ph"
            />
          </View>
          <View style={styles.messageBox}>
            <CustomTextInput
              label="Subject"
              value={subject.value}
              onChangeText={value => {
                onChangeSubject('value', value);
              }}
              keyboardType="default"
              returnKeyType="done"
              errorMessage={subject.error}
            />
          </View>
          <View style={styles.messageBox}>
            <CustomTextInput
              label="Message"
              style={{height: moderateScale(120)}}
              value={message.value}
              onChangeText={value => {
                onChangeMessage('value', value);
              }}
              keyboardType="default"
              returnKeyType="done"
              multiline={true}
              textAlignVertical="top"
              errorMessage={message.error}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <OrangeButton hasShadow onPress={onThrottledPress} label="Submit" />
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
    padding: 20,
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL + 5,
    color: COLOR.ORANGE,
    marginBottom: 10,
  },
  itemList: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  contact: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'center',
  },
  messageBox: {
    paddingBottom: moderateScale(15),
  },
  submitBtn: {
    paddingVertical: moderateScale(20),
  },
});
