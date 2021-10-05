
export class TransactionUtility {

    static StandardErrorHandling = ({
        error,
        navigation,
        alert,
        onErrorAlert,
        setOpenPinCode = null,
        setOpenOtpCode = null,
        setPinCodeAttempt = null,
        setOtpCodeAttempt = null
    })=> {
        const {graphQLErrors, networkError} = error;
        if(graphQLErrors[0].message == "Account does not have enough balance."){
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
            return onErrorAlert({alert,error})
        }

        if(graphQLErrors[0]?.payload?.code == "INVALIDTPIN"){
            return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
        }

        if(graphQLErrors[0]?.payload?.code == "INVALIDOTP"){
            return setOtpCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
        }

        if(setOpenPinCode) setOpenPinCode(false)
        if(setOpenOtpCode) setOpenOtpCode(false)
        onErrorAlert({alert,error})
        return navigation.pop()
    }
}