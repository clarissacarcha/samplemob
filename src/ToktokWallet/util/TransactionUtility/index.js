const numWordArray = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "10": "ten"
}
export class TransactionUtility {

  static StandardErrorHandling = ({
    error,
    navigation,
    setErrorMessage = null,
    prompt,
    onErrorAlert,
    alert,
    title = "Transaction Void"
  })=> {
    
    const {graphQLErrors, networkError} = error;

    if(networkError){
      return alert({message: 'Network error occurred. Please check your internet connection.'});
    }

    if(graphQLErrors[0]?.code === "FORBIDDEN" && graphQLErrors[0]?.message === "toktokwallet account not active"){
      //alert({message: 'toktokwallet account has been deactivated.'});
      // navigation.navigate("ToktokWalletLoginPage")
      // navigation.replace("ToktokWalletLoginPage")
      navigation.navigate("ToktokLandingHome")
      navigation.push("ToktokWalletLoginPage")  
      return;
    }

    if(graphQLErrors[0]?.message == "Account does not have enough balance."){
      navigation.navigate("ToktokWalletHomePage")
      navigation.replace("ToktokWalletHomePage")
      return prompt({
        type: "error",
        message: "You do not have sufficient balance to continue.",
        event: "TOKTOKWALLET",
        title: "Insufficient Balance"
      })
    }

    if(graphQLErrors[0]?.payload?.code == "INVALIDTPIN"){
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts
      const times = remainingAttempt == "1" ? "attempt" : "attempts"
      const message = `Incorrect TPIN. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${times} left.`
      if(setErrorMessage){
        setErrorMessage(message)
        return;
      }
      navigation.navigate("ToktokWalletTPINValidator", {
        errorMessage: message
      })
      return;
    }

    if(graphQLErrors[0]?.payload?.code == "INVALIDOTP"){
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts
      const times = remainingAttempt == "1" ? "attempt" : "attempts"
      const message = `Incorrect OTP. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${times} left.`
      if(setErrorMessage){
        setErrorMessage(message)
        return;
      }
      navigation.navigate("ToktokWalletOTPValidator", {
        errorMessage: message
      })
      return;
    }

    if(graphQLErrors[0]?.message == "Verification code already expired."){
      const message = `Verification code already expired.`
      if(setErrorMessage){
        setErrorMessage(message)
        return;
      }
      navigation.navigate("ToktokWalletOTPValidator", {
        errorMessage: message
      })
      return;
    }


    // PROMPT EVENTS
    if(prompt){
      let promptTitle = null;
      let promptType = "error";
      switch(graphQLErrors[0]?.payload?.code){
        case "VALIDATORMAXREQUEST":
          promptTitle = "Max Attempt Reached";
          promptType = "warning";
          break;
        case "OTPMAXREQUEST":
          promptTitle = "Max Attempt Reached";
          promptType = "warning";
          break;
        default:
          promptTitle = title;
          break;
      }

      prompt({
        type: promptType,
        message: graphQLErrors[0]?.message,
        event: "TOKTOKWALLET",
        title: promptTitle
      })
    }
    return navigation.pop()
  }
}