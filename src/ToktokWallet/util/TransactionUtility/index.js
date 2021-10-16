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
        alert,
        onErrorAlert,
        setErrorMessage = null
    })=> {
        const {graphQLErrors, networkError} = error;
        if(graphQLErrors[0].message == "Account does not have enough balance."){
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
            return onErrorAlert({alert,error})
        }

        if(graphQLErrors[0]?.payload?.code == "INVALIDTPIN"){
            const remainingAttempt = graphQLErrors[0].payload.remainingAttempts
            const times = remainingAttempt == "1" ? "time" : "times"
            const message = `Incorrect TPIN. You can try ${numWordArray[remainingAttempt]} (${remainingAttempt}) more ${times} before your account will be temporarily suspended.`
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
            const times = remainingAttempt == "1" ? "time" : "times"
            const message = `Incorrect OTP. You can try ${numWordArray[remainingAttempt]} (${remainingAttempt}) more ${times} before your account will be temporarily suspended.`
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

        onErrorAlert({alert,error})
        return navigation.pop()
    }
}