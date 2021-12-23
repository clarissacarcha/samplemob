import React from 'react'
import { View } from 'react-native'
//SELF IMPORTS
import {
    EnterOtpCode,
    EnterPinCode
} from "."
import { AlertOverlay } from 'src/components'

export const ValidatorScreen = ({
    TPINVisible,
    setTPINVisible,
    tpinCodeAttempt,
    OTPVisible,
    setOTPVisible,
    otpCodeAttempt,
    otpResend,
    callBackFunc,
    loading,
})=> {

    return (
        <>
            <AlertOverlay visible={loading}/>
            <EnterPinCode 
                 visible={TPINVisible}
                 setVisible={setTPINVisible}
                 pinCodeAttempt={tpinCodeAttempt}
                 callBackFunc={callBackFunc}
            />
            <EnterOtpCode 
                  visible={OTPVisible}
                  setVisible={setOTPVisible}
                  callBackFunc={callBackFunc}
                  otpCodeAttempt={otpCodeAttempt}
                  resend={otpResend}
            />
        </>
    )
}