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
export class ErrorUtility {

  static StandardErrorHandling = ({
    error,
    navigation,
    setErrorMessage = null,
    prompt,
    title = "Transaction Failed"
  })=> {
    
    const {graphQLErrors, networkError} = error;
  
    if(networkError){
      prompt({
        type: "error",
        title: "No Internet Connection",
        message: "Network error occurred. Please check your internet connection.",
        event: "TOKTOKBILLSLOAD"
      });
      return;
    }
    if(graphQLErrors[0]?.payload?.code == "INVALIDTPIN"){
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts
      const attempts = remainingAttempt == "1" ? "attempt" : "attempts"
      const message = `Incorrect TPIN. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${attempts} left.`
      if(setErrorMessage){
        setErrorMessage(message)
        return;
      }
      navigation.navigate("ToktokBillsEnterTPIN", {
        errorMessage: message
      })
      return;
    }

    if(graphQLErrors[0]?.payload?.code == "INVALIDOTP"){
      const remainingAttempt = graphQLErrors[0].payload.remainingAttempts
      const attempts = remainingAttempt == "1" ? "attempt" : "attempts"
      const message = `Incorrect OTP. You have ${numWordArray[remainingAttempt]} (${remainingAttempt}) ${attempts} left.`
      if(setErrorMessage){
        setErrorMessage(message)
        return;
      }
      navigation.navigate("ToktokBillsEnterOTP", {
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
      navigation.navigate("ToktokBillsEnterOTP", {
        errorMessage: message
      })
      return;
    }

    if(graphQLErrors[0]?.payload?.code == "loadPending"){
      prompt({
        type: "warning",
        title: graphQLErrors[0]?.payload?.errorTitle,
        message: graphQLErrors[0]?.message,
        event: "TOKTOKBILLSLOAD",
        onPress: () => navigation.navigate("ToktokLoadHome")
      });
      return;
    }
    
    const maxAttempt = graphQLErrors[0]?.payload?.code == "VALIDATORMAXREQUEST";
    prompt({
      type: maxAttempt ? "warning" : "error",
      title: maxAttempt ? "Max Attempt Reached" : title,
      message: graphQLErrors[0]?.message,
      event: "TOKTOKBILLSLOAD"
    });

    if(title){
      return navigation.navigate("ToktokLoadHome");
    }
  }
}