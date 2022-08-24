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
  console.log(answer);
  return (
    <View style={styles.ViewInput}>
      <Text style={styles.labelText}>{question}</Text>
      <Text style={styles.viewAnswerText}>{answer}</Text>
    </View>
  );
};

export const ViewAccountRecovery = ({data}) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={{height: 10, backgroundColor: '#F6841F'}} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        <PolicyNote note1="Account Recovery helps you recover your account once deactivated or locked due to forgotten MPIN." />
        <View style={styles.container}>
          <Text style={styles.headerText}>Security Questions</Text>
          <Text style={styles.headerMessage}>
            Answer the Security Questionnaire that will be used for authentication in your account recovery process.
            Note that the answers cannot be edited or changed once saved.
          </Text>
          {data.map((data, index) => (
            <Question question={data.accountRecoveryQuestion.question} answer={data.answer} index={index} />
          ))}
        </View>
      </ScrollView>
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
