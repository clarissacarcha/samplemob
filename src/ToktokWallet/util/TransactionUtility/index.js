const numWordArray = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};
export class TransactionUtility {
  static StandardErrorHandling = ({
    error,
    navigation,
    setErrorMessage = null,
    prompt,
    onErrorAlert,
    alert,
    title = 'Transaction Failed',
    event = null,
  }) => {
    const {graphQLErrors, networkError} = error;

    if (networkError) {
      if (prompt) {
        return prompt({
          type: 'error',
          title: 'No Internet Connection',
          message: 'Network error occurred. Please check your internet connection.',
          event: 'TOKTOKBILLSLOAD',
        });
      }
      return alert({message: 'Network error occurred. Please check your internet connection.'});
    }

    if (graphQLErrors[0]?.message === 'Account Blocked') {
      navigation.navigate('ToktokLandingHome');
      navigation.push('ToktokWalletLoginPage');
      return;
    }

    if (graphQLErrors[0]?.code === 'FORBIDDEN' && graphQLErrors[0]?.message === 'toktokwallet account not active') {
      //alert({message: 'toktokwallet account has been deactivated.'});
      // navigation.navigate("ToktokWalletLoginPage")
      // navigation.replace("ToktokWalletLoginPage")
      navigation.navigate('ToktokLandingHome');
      navigation.push('ToktokWalletLoginPage');
      return;
    }

    if (graphQLErrors[0]?.message == 'Account does not have enough balance.') {
      navigation.navigate('ToktokWalletHomePage');
      navigation.replace('ToktokWalletHomePage');
      return prompt({
        type: 'error',
        message: 'You do not have sufficient balance to continue.',
        event: 'TOKTOKWALLET',
        title: 'Insufficient Balance',
      });
    }

    if (graphQLErrors[0]?.payload?.code == 'INVALIDTPIN') {
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts;
      const times = remainingAttempt == '1' ? 'attempt' : 'attempts';
      const message = `Incorrect TPIN. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${times} left.`;
      if (setErrorMessage) {
        setErrorMessage(message);
        return;
      }
      navigation.navigate('ToktokWalletTPINValidator', {
        errorMessage: message,
      });
      return;
    }

    if (graphQLErrors[0]?.message === 'Invalid MPincode') {
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts;
      const times = remainingAttempt == '1' ? 'attempt' : 'attempts';
      const message = `Incorrect MPIN. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${times} left.`;
      if (setErrorMessage) {
        setErrorMessage(message);
        return;
      }
      navigation.navigate('ToktokWalletMPINCreate', {
        errorMessage: message,
      });
      return;
    }

    if (graphQLErrors[0]?.payload?.code == 'INVALIDOTP') {
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts;
      const times = remainingAttempt == '1' ? 'attempt' : 'attempts';
      const message = `Incorrect OTP. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${times} left.`;
      if (setErrorMessage) {
        setErrorMessage(message);
        return;
      }
      navigation.navigate('ToktokWalletOTPValidator', {
        errorMessage: message,
      });
      return;
    }

    if (graphQLErrors[0]?.message == 'Verification code already expired.') {
      const message = `Verification code already expired.`;
      if (setErrorMessage) {
        setErrorMessage(message);
        return;
      }
      navigation.navigate('ToktokWalletOTPValidator', {
        errorMessage: message,
      });
      return;
    }

    // PROMPT EVENTS
    if (prompt) {
      let promptTitle = null;
      let promptType = 'error';
      switch (graphQLErrors[0]?.payload?.code) {
        case 'VALIDATORMAXREQUEST':
          promptTitle = 'Max Attempt Reached';
          promptType = 'warning';
          break;
        case 'OTPMAXREQUEST':
          promptTitle = 'Max Attempt Reached';
          promptType = 'warning';
          break;
        default:
          promptTitle = graphQLErrors[0]?.payload?.errorTitle ? graphQLErrors[0]?.payload?.errorTitle : title;
          break;
      }

      const finalPrompType = graphQLErrors[0]?.payload?.errorType ? graphQLErrors[0]?.payload?.errorType : promptType;
      let promptMessage = graphQLErrors[0]?.message;
      if (
        event == 'fundTransfer' &&
        graphQLErrors[0]?.code == 'INTERNAL_SERVER_ERROR' &&
        graphQLErrors[0]?.message == 'Something went wrong.'
      ) {
        promptTitle = 'Transaction Pending';
        promptMessage = '';
      }

      prompt({
        type: finalPrompType,
        message: promptMessage,
        event: 'TOKTOKBILLSLOAD',
        title: promptTitle,
      });

      if (graphQLErrors[0]?.payload?.code == 'fundTransferPending') {
        return navigation.navigate('ToktokWalletCashOutOtherBanks');
      }
    }
    return navigation.pop();
  };
}
