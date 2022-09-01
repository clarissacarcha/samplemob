/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {KeyboardAvoidingContainer, ScrollViewContainer} from './Styled';
import {Dimensions, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
//HOOKS & GRAPHQL
import {useThrottle} from 'src/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_SEND_MESSAGE} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {useMutation} from '@apollo/react-hooks';
//COMPONENTS
import {AlertOverlay} from 'src/components';
import {HeaderBack, HeaderTitleRevamp, CheckIdleState, OrangeButton} from 'toktokwallet/components';
//COMPOSITIONS
import {ContactUsForm, ContactUsHeader} from 'toktokwallet/compositions';
//ASSETS, HELPERS & UTIL
import {TransactionUtility} from 'toktokwallet/util';
import {getStatusbarHeight} from 'toktokwallet/helper';

const screen = Dimensions.get('window');

const ToktokWalletHelpCentreContactUs = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Contact Us'} />,
  });

  const [message, setMessage] = useState({error: '', value: ''});
  const [subject, setSubject] = useState({error: '', value: ''});
  const prompt = usePrompt();
  const headerHeight = useHeaderHeight();

  const [postSendMessage, {loading}] = useMutation(POST_SEND_MESSAGE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
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

  const onChangeSubject = (key: string, value: string) => {
    setSubject(oldState => ({...oldState, error: '', [key]: value ? value.replace(/^\s+/, '') : ''}));
    if (key === 'error') {
      return value;
    }
  };

  const onChangeMessage = (key: string, value: string) => {
    setMessage(oldState => ({...oldState, error: '', [key]: value.replace(/^\s+/, '')}));
    if (key === 'error') {
      return value;
    }
  };

  const processSendEmail = () => {
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

  const onThrottledPress = useThrottle(processSendEmail, 2000);

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <KeyboardAvoidingContainer
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight + getStatusbarHeight : screen.height * 0.5}>
        <ScrollViewContainer>
          <ContactUsHeader />
          <ContactUsForm
            subject={subject}
            message={message}
            onChangeSubject={(key, value) => onChangeSubject(key, value)}
            onChangeMessage={(key, value) => onChangeMessage(key, value)}
          />
        </ScrollViewContainer>
      </KeyboardAvoidingContainer>
      <OrangeButton hasShadow onPress={onThrottledPress} label="Submit" />
    </CheckIdleState>
  );
};

export default ToktokWalletHelpCentreContactUs;
