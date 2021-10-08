import React , {useState} from 'react'
import { numberFormat } from 'toktokwallet/helper'
import { TransactionUtility } from 'toktokwallet/util'
import { YellowButton } from 'src/revamp'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_FUND_TRANSFER , POST_REQUEST_SEND_MONEY , POST_SEND_MONEY } from 'toktokwallet/graphql'
import { DisabledButton , EnterPinCode , EnterOtpCode , ValidatorScreen } from 'toktokwallet/components'
import { AlertOverlay } from 'src/components'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

export const ProceedButton = ({swipeEnabled , navigation , amount , note , tokwaAccount , recipientDetails })=> {

    const alert = useAlert()
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })
    const [pinCodeAttempt,setPinCodeAttempt] = useState(6)
    const [openPinCode,setOpenPinCode] = useState(false)
    const [otpCodeAttempt,setOtpCodeAttempt] = useState(6)
    const [openOtpCode,setOpenOtpCode] = useState(false)
    const [requestSendMoneyId,setRequestSendMoneyId] = useState(null)

    const [postRequestSendMoney , {loading: requestLoading}] = useMutation(POST_REQUEST_SEND_MONEY, {
        client:TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestSendMoney})=>{
            const { validator , requestSendMoneyId } = postRequestSendMoney
            setRequestSendMoneyId(requestSendMoneyId)
            if(validator == "TPIN"){
                setPinCodeAttempt(6)
                return setOpenPinCode(true)
            }else{
                setOtpCodeAttempt(6)
                return setOpenOtpCode(true)
            }
        },
        onError: (error)=>{
            setOpenPinCode(false)
            setOpenOtpCode(false)
            onErrorAlert({alert,error})
        }
    })

    const [postSendMoney , {data ,error, loading }] = useMutation(POST_SEND_MONEY , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postSendMoney})=> {
            setOpenPinCode(false)
            setOpenOtpCode(false)
            setWalletinfoParams(postSendMoney)
            setSuccessModalVisible(true)
        },
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                alert,
                onErrorAlert,
                setOpenPinCode,
                setOpenOtpCode,  
                setPinCodeAttempt,
                setOtpCodeAttempt,       
            })
        }
    })


    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            event: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Send ${tokwaAccount.wallet.currency.code} ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                note: note,
                recipient: {
                    name: `${recipientDetails.person.firstName} ${recipientDetails.person.middleName ? recipientDetails.person.middleName + " " : ""}${recipientDetails.person.lastName}`,
                    mobileNo: recipientDetails.mobileNumber,
                },
            }
        })
    }

    const Proceed = ({pinCode = null , Otp = null })=> {
        postSendMoney({
            variables: {
                input: {
                    requestSendMoneyId: requestSendMoneyId,
                    OTP: Otp,
                    TPIN: pinCode
                }
            },
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        postRequestSendMoney({
            variables: {
                input: {
                    amount: +amount,
                    note: note,
                    destinationMobileNo: recipientDetails.mobileNumber,
                }
            }
        })

        // setPinCodeAttempt(6)
        // return setOpenPinCode(true)
        //return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer , callBackFunction: Proceed , loading: loading, pinRemainingCodeAttempt: pinCodeAttempt})
    }

    return (
       <>
        <AlertOverlay visible={requestLoading}/>
        <ValidatorScreen
            TPINVisible={openPinCode}
            setTPINVisible={setOpenPinCode}
            tpinCodeAttempt={pinCodeAttempt}
            OTPVisible={openOtpCode}
            setOTPVisible={setOpenOtpCode}
            otpCodeAttempt={otpCodeAttempt}
            otpResend={onSwipeSuccess}
            callBackFunc={Proceed}
            loading={loading}
        />
        {/* <EnterPinCode 
            visible={openPinCode} 
            setVisible={setOpenPinCode} 
            loading={loading}
            pinCodeAttempt={pinCodeAttempt}
            callBackFunc={Proceed}
        >
            <AlertOverlay visible={loading} />
        </EnterPinCode>

        <EnterOtpCode
            visible={openOtpCode}
            setVisible={setOpenOtpCode}
            callBackFunc={Proceed}
            otpCodeAttempt={otpCodeAttempt}
            resend={onSwipeSuccess}
        >
            <AlertOverlay visible={loading} />
        </EnterOtpCode> */}

        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount}
                note={note} 
                recipient={{
                    name: `${recipientDetails.person.firstName} ${recipientDetails.person.middleName ? recipientDetails.person.middleName + " " : ""}${recipientDetails.person.lastName}`,
                    mobileNo: recipientDetails.mobileNumber
                }}
                walletinfoParams={walletinfoParams}
            />
                 {   swipeEnabled 
                     ? <YellowButton label="Proceed" onPress={reviewAndConfirm}/>
                     : <DisabledButton label="Proceed" />
                 }
       </>
    )
}
