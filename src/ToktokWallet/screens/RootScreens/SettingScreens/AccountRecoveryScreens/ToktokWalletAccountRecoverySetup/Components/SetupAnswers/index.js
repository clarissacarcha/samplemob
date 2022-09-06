import React, {useState, useEffect} from 'react';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT_RECOVERY_QUESTIONS} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

//SELF IMPORTS
import {PageProgressBar} from 'toktokwallet/components';
import Questions from './Questions';
import Confirm from './Confirm';

// const questions = [
//     "What is your mother's maiden name?",
//     "When is your Birthday?",
//     "What is your current Address?",
// ]

export const SetupAnswers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const alert = useAlert();

  const [getAccountRecoveryQuestions, {loading}] = useLazyQuery(GET_ACCOUNT_RECOVERY_QUESTIONS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAccountRecoveryQuestions}) => {
      setQuestions(getAccountRecoveryQuestions);
    },
    onError: error => onErrorAlert({alert, error}),
  });

  useEffect(() => {
    getAccountRecoveryQuestions();
  }, []);

  const RenderComponent = () => {
    switch (currentIndex) {
      case 0:
        return (
          <Questions
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case 1:
        return (
          <Confirm
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            questions={questions}
            answers={answers}
          />
        );
      default:
        break;
    }
  };

  return (
    <PageProgressBar
      screens={[
        <Questions
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
        />,
        <Confirm
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          questions={questions}
          answers={answers}
        />,
      ]}
      currentIndex={currentIndex}
    />
  );
};
