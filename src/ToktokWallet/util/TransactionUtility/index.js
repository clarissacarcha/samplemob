
export class TransactionUtility {

    static StandardErrorHandling = ({
        error,
        navigation,
        alert,
        onErrorAlert,
        setOpenPinCode,
        setOpenOtpCode,
        setPinCodeAttempt
    })=> {
        const {graphQLErrors, networkError} = error;
        if(graphQLErrors[0].message == "Account does not have enough balance."){
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
            return onErrorAlert({alert,error})
        }
    
        if(graphQLErrors[0].message == "Wallet Hold"){
            setOpenPinCode(false)
            navigation.navigate("ToktokWalletLoginPage")
            navigation.replace("ToktokWalletLoginPage")
            return navigation.push("ToktokWalletRestricted", {component: "onHold"})
        }

        if(graphQLErrors[0].message == "Invalid Pincode"){
            return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
        }
        setOpenPinCode(false)
        setOpenOtpCode(false)
        onErrorAlert({alert,error})
        return navigation.pop()


    }

}