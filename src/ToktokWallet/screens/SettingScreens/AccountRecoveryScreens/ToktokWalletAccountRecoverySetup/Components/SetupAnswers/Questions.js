import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import {YellowButton} from 'src/revamp';
import {DisabledButton, CustomDateInput, OrangeButton, CustomTextInput, PolicyNote} from 'toktokwallet/components';
import {getStatusbarHeight} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import {useHeaderHeight} from '@react-navigation/stack';
import moment from 'moment';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const screen = Dimensions.get('window');

export const DisplayQuestion = ({question, answers, setAnswers, index, errorMessages, setErrorMessages}) => {
  const onChangeText = value => {
    setErrorMessages(state => {
      state[index] = '';
      return [...state];
    });

    setAnswers(state => {
      if (value !== '') {
        state[index] = {
          accountRecoveryQuestionId: question.id,
          answer: question.isDatepicker ? moment(value).format('YYYY-MM-DD') : value,
        };
      } else {
        state[index] = undefined;
      }

      return [...state];
    });
  };

  return (
    <>
      {question.isDatepicker ? (
        <View style={styles.ViewInput}>
          <CustomDateInput
            label={question?.question}
            onSelectedValue={onChangeText}
            selectedValue={answers[index]?.answer ? answers[index]?.answer : ''}
            errorMessage={errorMessages[index]}
            dateFormat="MMM D, YYYY"
          />
        </View>
      ) : (
        <View style={styles.ViewInput}>
          <CustomTextInput
            label={question?.question}
            onChangeText={onChangeText}
            value={answers[index]?.answer ? answers[index].answer : ''}
            errorMessage={errorMessages[index]}
            returnKeyType="done"
            // maxLength={question.maxLength}
          />
        </View>
      )}
    </>
  );
};

export const RenderNextButton = ({questions, btnEnabled, onPress}) => {
  if (questions.length == 0) return null;
  if (btnEnabled && questions.length > 0) return <YellowButton label="Next" onPress={onPress} />;
  return <DisabledButton label="Next" />;
};

const Questions = ({questions, answers, currentIndex, setCurrentIndex, setAnswers}) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = headerHeight + getStatusbarHeight;

  const onPress = () => {
    questions.forEach((item, index) => {
      setErrorMessages(state => {
        if (answers.length > 0) {
          state[index] = answers[index] !== undefined ? '' : 'This is a required field';
        } else {
          state[index] = answers[index] !== undefined ? '' : 'This is a required field';
        }
        return [...state];
      });
    });

    const [a, b, c] = [...answers];
    if (a !== undefined && b !== undefined && c !== undefined) {
      setCurrentIndex(value => value + 1);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : screen.height * 0.5}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <PolicyNote note1="Account Recovery helps you recover your account once deactivated or locked due to forgotten MPIN." />
          <View style={styles.body}>
            <Text style={styles.headerText}>Security Questions</Text>
            <Text style={styles.headerMessage}>
              Answer the Security Questionnaire that will be used for authentication in your account recovery process.
              Note that the answers cannot be edited or changed once saved.
            </Text>
            {questions.map((question, index) => {
              return (
                <DisplayQuestion
                  question={question}
                  answers={answers}
                  setAnswers={setAnswers}
                  index={index}
                  errorMessages={errorMessages}
                  setErrorMessages={setErrorMessages}
                />
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <OrangeButton hasShadow onPress={onPress} label="Next" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  btn: {
    height: 70,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  headerText: {
    fontFamily: FONT.BOLD,
  },
  headerMessage: {
    marginVertical: 5,
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  labelText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    marginBottom: 10,
  },
  labelSmall: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#929191',
  },
  ViewInput: {
    marginTop: 10,
  },
  input: {
    paddingHorizontal: 10,
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  errorMessage: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.XS,
    color: COLOR.RED,
  },
  secondContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default Questions;
