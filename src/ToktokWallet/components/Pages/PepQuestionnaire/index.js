import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Modal, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {getStatusbarHeight} from 'toktokwallet/helper';
import {Separator, PolicyNote, PreviousNextButton, CustomTextInput} from 'toktokwallet/components';
import {YellowButton, VectorIcon, ICON_SET} from 'src/revamp';
import CheckBox from 'react-native-check-box';

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
      });
    }
  }, [answer]);

  return (
    <View style={{marginTop: 10}}>
      <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S, color: '#525252'}}>{question}</Text>
      <View style={{flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between'}}>
        {answers.map((ans, index) => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              isChecked={answer?.value == ans.value}
              onClick={() => setAnswer(ans)}
              checkBoxColor={COLOR.ORANGE}
              checkedCheckBoxColor={COLOR.ORANGE}
            />
            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, marginLeft: 10}}>{ans.display}</Text>
          </View>
        ))}
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

export const PepQuestionnaire = ({pepInfo, setPepInfo, callback, setCurrentIndex}) => {
  const [errorMessage, setErrorMessage] = useState(['', '', '', '', '', '']);
  const [readMorePEP, setReadMorePEP] = useState(false);

  const onPress = () => {
    callback();
  };

  const chooseAnswer = ({ans, position, index}) => {
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
    let errorMessage = value === '' ? 'This field is required' : '';

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
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
              I hereby certify that the above information is complete, true, and correct as to the best of my knowledge.
            </Text>
          </View>
        </View>
      </ScrollView>
      <PreviousNextButton label="Previous" labelTwo={'Next'} hasShadow onPressNext={Next} onPressPrevious={Previous} />
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
