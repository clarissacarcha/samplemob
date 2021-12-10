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
    title = "Transaction Failed",
    isPop = false
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
      const times = remainingAttempt == "1" ? "time" : "times"
      const message = `Incorrect TPIN. You have ${remainingAttempt} attempt/s left.`
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
      const times = remainingAttempt == "1" ? "time" : "times"
      const message = `Incorrect OTP. You have ${remainingAttempt} attempt/s left.`
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
   
    prompt({
      type: title ? "error" : "warning",
      title,
      message: graphQLErrors[0]?.message,
      event: "TOKTOKBILLSLOAD"
    });

    if(isPop){
      return navigation.pop();
    }
  }
}