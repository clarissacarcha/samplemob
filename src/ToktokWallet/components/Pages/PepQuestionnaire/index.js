import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ScrollView, KeyboardAvoidingView} from 'react-native';
import {getStatusbarHeight, moderateScale} from 'toktokwallet/helper';
import {
  PolicyNote,
  PreviousNextButton,
  CustomTextInput,
  OrangeButton,
  CustomRadioButton,
} from 'toktokwallet/components';
import CheckBox from 'react-native-check-box';
import {useHeaderHeight} from '@react-navigation/stack';

//SELF IMPORTS
import {AboutPEPModal, SourceOfIncome, SourceOfWealth} from './Components';

import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE} = CONSTANTS;

const Question = ({question, errorMessage, setErrorMessage, index, chooseAnswer, pepInfoAnswer}) => {
  const answers = [
    {value: '1', display: 'Yes', position: ''},
    {value: '2', display: 'No', position: ''},
    {value: '3', display: "I don't know", position: ''},
  ];
  const [answer, setAnswer] = useState(pepInfoAnswer);
  const onChangeText = text => {
    setErrorMessage(state => {
      state[index] = '';
      return [...state];
    });

    setAnswer(state => ({
      ...state,
      position: text,
    }));
  };

  useEffect(() => {
    if (answer) {
      chooseAnswer({
        ans: answer?.value,
        position: answer?.position,
        index: index,
        selectedIndex: answer?.value,
      });
    }
  }, [answer]);

  return (
    <View style={{marginTop: 10}}>
      <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S, color: '#525252'}}>{question}</Text>
      <View style={{flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between'}}>
        <CustomRadioButton
          data={answers}
          multipleLabel={false}
          onPress={(index, item) => {
            setAnswer(item);
          }}
          selected={+answer?.value - 1}
          buttonInnerColor={COLOR.ORANGE}
          buttonOuterColor={COLOR.ORANGE}
          horizontal
        />
      </View>
      {answer?.value == '1' && (
        <>
          <CustomTextInput
            value={answer.position}
            onChangeText={onChangeText}
            style={styles.input}
            placeholder="Specify position"
            maxLength={50}
            placeholderTextColor="#9E9E9E"
            errorMessage={errorMessage[index]}
          />
        </>
      )}
    </View>
  );
};

export const PepQuestionnaire = ({pepInfo, setPepInfo, callback, setCurrentIndex, hasPreviousButton = true , isKyc = true}) => {
  const [errorMessage, setErrorMessage] = useState(['', '', '', '', '', '']);
  const [readMorePEP, setReadMorePEP] = useState(false);
  const headerHeight = useHeaderHeight();

  const onPress = () => {
    callback();
  };

  const chooseAnswer = ({ans, position, index, selectedIndex}) => {
    // console.log(selectedIndex);
    if (index == 0) {
      setPepInfo(state => {
        return {
          ...state,
          questionnaire: {
            ...state.questionnaire,
            isPep: ans,
            pepPosition: position,
          },
        };
      });
    }

    if (index == 1) {
      setPepInfo(state => {
        return {
          ...state,
          questionnaire: {
            ...state.questionnaire,
            isFamilyPep: ans,
            familyPepPosition: position,
          },
        };
      });
    }
  };

  const Previous = () => {
    setCurrentIndex(oldval => oldval - 1);
  };

  const checkFieldIsEmpty = (index, value, fieldType) => {
    let errorMessage = value === '' ? 'This is a required field' : '';

    setErrorMessage(state => {
      state[index] = errorMessage;
      return [...state];
    });
    return !errorMessage;
  };

  const checkFieldIsEmptyArray = (index, value, fieldType) => {
    let errorMessage = value.length > 0 ? '' : 'Please make a selection';

    setErrorMessage(state => {
      state[index] = errorMessage;
      return [...state];
    });

    return !errorMessage;
  };

  const Next = () => {
    const {
      isPep,
      pepPosition,
      isFamilyPep,
      familyPepPosition,
      sourceOfIncomeId,
      sourceOfIncome,
      sourceOfWealthId,
      sourceOfWealth,
      sourceOfWealthDes,
      agreement,
    } = pepInfo.questionnaire;
    const isValidPepPosition = isPep == '1' ? checkFieldIsEmpty(0, pepPosition) : true;
    const isValidFamilyPepPosition = isFamilyPep == '1' ? checkFieldIsEmpty(1, familyPepPosition) : true;
    const isValidSourceOfIncome = sourceOfIncomeId.includes('0')
      ? checkFieldIsEmpty(3, sourceOfIncome)
      : checkFieldIsEmptyArray(2, sourceOfIncomeId);
    const isValidSourceOfWealth = sourceOfWealthId.includes('0')
      ? checkFieldIsEmpty(5, sourceOfWealth)
      : checkFieldIsEmptyArray(4, sourceOfWealthId);

    if (
      isPep != '' &&
      isValidPepPosition &&
      isFamilyPep != '' &&
      isValidFamilyPepPosition &&
      isValidSourceOfIncome &&
      isValidSourceOfWealth &&
      agreement
    ) {
      setCurrentIndex(oldval => oldval + 1);
    }
  };

  return (
    <>
      <AboutPEPModal visible={readMorePEP} setVisible={setReadMorePEP} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        keyboardVerticalOffset={getStatusbarHeight + headerHeight + moderateScale(10)}>
        <ScrollView>
          <PolicyNote
            note1="Click here to read more about Politically Exposed Person (PEP)."
            disabled={false}
            onPress={() => {
              setReadMorePEP(true);
            }}
          />
          <View style={styles.headings}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, marginTop: 15}}>PEP Questionnaire</Text>
            <View style={styles.questions}>
              <Question
                question="Have you ever been categorized as PEP (Political Exposed Person)
                            by a bank, brokerage firm, or any financial institution?"
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                chooseAnswer={chooseAnswer}
                pepInfoAnswer={{
                  value: pepInfo.questionnaire.isPep,
                  position: pepInfo.questionnaire.pepPosition,
                }}
                index={0}
              />

              <Question
                question="Do you have an immediate family member or business/close
                            associate which is currently/formally qualified as PEP?"
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                chooseAnswer={chooseAnswer}
                pepInfoAnswer={{
                  value: pepInfo.questionnaire.isFamilyPep,
                  position: pepInfo.questionnaire.familyPepPosition,
                }}
                index={1}
              />
              <SourceOfIncome
                pepInfoAnswer={{
                  value: pepInfo.questionnaire.sourceOfIncomeId,
                  des: pepInfo.questionnaire.sourceOfIncomeDes,
                  others: pepInfo.questionnaire.sourceOfIncome,
                  selected: pepInfo.questionnaire.selectedSourceOfIncome,
                }}
                setPepInfo={setPepInfo}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isKyc={isKyc}
              />

              <SourceOfWealth
                pepInfoAnswer={{
                  value: pepInfo.questionnaire.sourceOfWealthId,
                  des: pepInfo.questionnaire.sourceOfWealthDes,
                  others: pepInfo.questionnaire.sourceOfWealth,
                  selected: pepInfo.questionnaire.selectedSourceOfWealth,
                }}
                setPepInfo={setPepInfo}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isKyc={isKyc}
              />
            </View>
            <View style={{flexDirection: 'row', marginVertical: 20, alignItems: 'center'}}>
              <CheckBox
                isChecked={pepInfo.questionnaire.agreement}
                onClick={() => {
                  setPepInfo(state => {
                    return {
                      ...state,
                      questionnaire: {
                        ...state.questionnaire,
                        agreement: !state.questionnaire.agreement,
                      },
                    };
                  });
                }}
                checkBoxColor={COLOR.ORANGE}
                checkedCheckBoxColor={COLOR.ORANGE}
              />
              <Text
                style={{
                  paddingRight: 16,
                  paddingLeft: 10,
                  fontFamily: FONT.REGULAR,
                  fontSize: FONT_SIZE.S,
                  textAlign: 'left',
                }}>
                I hereby certify that the above information is complete, true, and correct as to the best of my
                knowledge.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {hasPreviousButton ? (
        <PreviousNextButton
          label="Previous"
          labelTwo={'Next'}
          hasShadow
          onPressNext={Next}
          onPressPrevious={Previous}
        />
      ) : (
        <OrangeButton label="Next" hasShadow onPress={Next} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusbarHeight,
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  headings: {
    paddingHorizontal: 16,
  },
  questions: {
    // marginTop: 20,
  },
  answerbox: {
    borderWidth: 0.5,
    borderColor: COLOR.YELLOW,
    padding: 10,
    marginRight: 10,
  },
  input: {
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    paddingHorizontal: 10,
  },
  hitSlop: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
});
