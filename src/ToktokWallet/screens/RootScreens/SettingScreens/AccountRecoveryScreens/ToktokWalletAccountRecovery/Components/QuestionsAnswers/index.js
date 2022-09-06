import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {YellowButton} from 'src/revamp';
import {BuildingBottom, DisabledButton, PromptModal} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import moment from 'moment';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_FORGOT_AND_RECOVER_OTP_CODE, POST_VERIFY_ANSWERS} from 'toktokwallet/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, usePrompt} from 'src/hooks';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {TransactionUtility} from 'toktokwallet/util';

//SELF IMPORTS
import DateBirthModal from '../../../ToktokWalletAccountRecoverySetup/Components/SetupAnswers/DateBirthModal';
import {DisplayQuestion} from '../../../ToktokWalletAccountRecoverySetup/Components/SetupAnswers/Questions';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const screen = Dimensions.get('window');

export const QuestionsAnswers = ({data}) => {
  const alert = useAlert();
  const prompt = usePrompt();
  const navigation = useNavigation();
  const [showPrompt, setShowPrompt] = useState(false);

  const [answers, setAnswers] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [btnEnabled, setBtnEnabled] = useState(false);

  useEffect(() => {
    setBtnEnabled(+answers.length === +data.length);
  }, [answers, data]);

  const [getForgotAndRecoverOTPCode, {loading}] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getForgotAndRecoverOTPCode}) => {
      // return navigation.navigate("ToktokWalletAccountRecoveryOTP")
      return navigation.navigate('ToktokWalletRecoverPin', {type: 'MPIN', event: 'ACCOUNT RECOVERY'});
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

  const [postVerifyAnswers, {loading: verifyLoading}] = useMutation(POST_VERIFY_ANSWERS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postVerifyAnswers}) => {
      getForgotAndRecoverOTPCode();
    },
    onError: error => {
      setShowPrompt(true);
      // onErrorAlert({alert,error})
    },
  });
  const onPress = () => {
    const finalAnswers = answers.map(answer => answer.answer);
    postVerifyAnswers({
      variables: {
        input: {
          answers: finalAnswers,
        },
      },
    });
  };

  const closePrompt = () => {
    setShowPrompt(false);
    return navigation.navigate('ToktokWalletRestricted', {showPrompt: true});
  };

  return (
    <>
      <AlertOverlay visible={loading || verifyLoading} />
      <PromptModal
        visible={showPrompt}
        title="You have entered incorrect answer(s)"
        message="Please contact our Customer Service Representative for your Account Recovery"
        event="error"
        onPress={closePrompt}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
          {data.map((data, index) => {
            return (
              <DisplayQuestion
                question={data.accountRecoveryQuestion}
                answers={answers}
                setAnswers={setAnswers}
                index={index}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
            );
          })}
        </ScrollView>
        <View style={styles.btn}>
          {!btnEnabled ? <DisabledButton label="Confirm" /> : <YellowButton label="Confirm" onPress={onPress} />}
        </View>
        <BuildingBottom />
      </View>
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
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    marginVertical: 2,
  },
  labelText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
  labelSmall: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#929191',
  },
  ViewInput: {
    marginTop: 20,
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
});
