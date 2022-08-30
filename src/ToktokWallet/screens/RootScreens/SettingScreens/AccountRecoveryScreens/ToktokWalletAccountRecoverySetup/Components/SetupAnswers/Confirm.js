import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PreviousNextButton, PromptModal, PolicyNote} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_ACCOUNT_RECOVERY, POST_REQUEST_ACCOUNT_RECOVERY_OTP} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useAlert, usePrompt} from 'src/hooks';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {TransactionUtility} from 'toktokwallet/util';
import moment from 'moment';

const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const Question = ({question, answer, index}) => {
  let maskAsterisk = '';
  let ans = index === 1 ? moment(answer).tz('Asia/Manila').format('MMM DD, YYYY').toString() : answer;

  for (let x = 0; x < ans.length - 1; x++) {
    maskAsterisk = maskAsterisk + '-';
  }

  return (
    <View style={styles.ViewInput}>
      <Text style={styles.labelText}>{question}</Text>
      <Text style={styles.viewAnswerText}>{index === 1 ? `${ans[0]}${maskAsterisk}` : `${ans[0]}${maskAsterisk}`}</Text>
    </View>
  );
};

const Confirm = ({currentIndex, setCurrentIndex, questions, answers}) => {
  const alert = useAlert();
  const prompt = usePrompt();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const [postRequestAccountRecoveryOTP, {loading: requestLoading}] = useMutation(POST_REQUEST_ACCOUNT_RECOVERY_OTP, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postRequestAccountRecoveryOTP}) => {
      return navigation.navigate('ToktokWalletOTPValidator', {
        callBackFunc: Proceed,
        resendRequest: requestOTP,
      });
    },
    onError: error => {
      // onErrorAlert({alert,error,navigation,title: "Transaction Void"})
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        alert,
      });
    },
  });

  const [postAccountRecovery, {loading}] = useMutation(POST_ACCOUNT_RECOVERY, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: () => {
      prompt({
        type: 'success',
        title: 'Security Questions Set Up',
        message: 'Remember all your answers and do not share them with anyone.',
        event: 'TOKTOKBILLSLOAD',
        onPress: () => {
          navigation.pop();
          navigation.replace('ToktokWalletAccountRecoverySetup');
        },
      });
    },
    onError: error => {
      // onErrorAlert({alert,error,navigation})
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        alert,
      });
    },
  });

  const requestOTP = () => {
    postRequestAccountRecoveryOTP();
  };

  const Proceed = ({pinCode = null, Otp = null, data = null}) => {
    postAccountRecovery({
      variables: {
        input: {
          answers: answers,
          OTPCode: Otp,
        },
      },
    });
  };

  const onPressPrevious = () => {
    setCurrentIndex(oldState => oldState - 1);
  };

  return (
    <>
      <AlertOverlay visible={loading || requestLoading} />
      {/* <PromptModal
        visible={visible}
        title="Security Questions Set Up!"
        message={`${'1. Remember all your answers and do not share them with anyone.'}${'\n\n'}${'2. Always keep your MPIN and never share this with anyone.'}`}
        event="success"
        onPress={() => {
          setVisible(false);
          navigation.pop();
          navigation.replace('ToktokWalletAccountRecoverySetup');
        }}
      /> */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        <PolicyNote note1="Account Recovery helps you recover your account once deactivated or locked due to forgotten MPIN." />
        <View style={styles.container}>
          <Text style={styles.headerText}>Review and Confirm</Text>
          <Text style={styles.headerMessage}>Review all the details provided before clicking "Confirm".</Text>
          {questions.map((question, index) => (
            <Question question={question.question} answer={answers[index].answer} index={index} />
          ))}
        </View>
      </ScrollView>
      <PreviousNextButton
        label="Previous"
        labelTwo="Confirm"
        onPressNext={requestOTP}
        onPressPrevious={onPressPrevious}
        hasShadow
        isPrevious
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  body: {
    flex: 1,
  },
  btn: {
    height: 70,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontFamily: FONT.BOLD,
  },
  headerMessage: {
    marginVertical: 5,
    paddingBottom: 15,
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  labelText: {
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.BOLD,
    color: '#525252',
  },
  ViewInput: {
    marginBottom: 10,
  },
  viewAnswerText: {
    margin: 15,
  },
});

export default Confirm;
