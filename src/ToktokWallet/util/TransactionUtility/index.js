export class TransactionUtility {

    static StandardErrorHandling = ({
        error,
        navigation,
        onErrorAlert,
        setOpenPinCode,
        setPinCodeAttempt
    })=> {
        const { graphQLErrors , networkError } = error;

          // if(graphQLErrors[0]?.payload?.code == "VALIDATORMAXREQUEST"){  
            //     setOpenPinCode(false)
            //     onErrorAlert({alert,error})
            //     return navigation.pop()
            // }

        if(graphQLErrors[0].message == "Account does not have enough balance."){
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
            return onErrorAlert({alert,error})
        }

        if(graphQLErrors[0]?.message == "Wallet Hold"){
            setOpenPinCode(false)
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
            return navigation.push("ToktokWalletRestricted", {component: "onHold"})
        }
        if(graphQLErrors[0]?.message == "Invalid Pincode"){
            return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
        }

        // if(graphQLErrors[0]?.payload?.code == "INVALIDTPIN"){
        //     return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
        // }

        setOpenPinCode(false)
        onErrorAlert({alert,error})
        return navigation.pop()
    }
}