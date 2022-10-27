import React , {useState} from 'react'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import { TransactionUtility } from 'toktokwallet/util'
import { YellowButton } from 'src/revamp'
import {useAlert, usePrompt} from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_FUND_TRANSFER , POST_REQUEST_SEND_MONEY , POST_SEND_MONEY } from 'toktokwallet/graphql'
import { DisabledButton , ValidatorScreen } from 'toktokwallet/components'
import { AlertOverlay } from 'src/components'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

export const ProceedButton = ({ isCertify, setSwipeEnabled ,swipeEnabled , navigation , amount , note , tokwaAccount , recipientDetails , proceed , errorAmountMessage , setErrorAmountMessage })=> {

    const prompt = usePrompt()
    const alert = useAlert()
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })

    const [postRequestSendMoney , {loading: requestLoading}] = useMutation(POST_REQUEST_SEND_MONEY, {
        client:TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestSendMoney})=>{
            const { validator , requestSendMoneyId } = postRequestSendMoney
            const screen = validator == "TPIN" ? "ToktokWalletTPINValidator" : "ToktokWalletOTPValidator"
            return navigation.navigate(screen, {
                callBackFunc: Proceed,
                resendRequest: onSwipeSuccess ,
                data: {
                    requestSendMoneyId: requestSendMoneyId
                },
                btnLabel: "Confirm"
            })
        },
        onError: (error)=>{
            // onErrorAlert({alert,error,navigation,title: "Transaction Void"})
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert
            })
        }
    })

    const [postSendMoney , {data ,error, loading }] = useMutation(POST_SEND_MONEY , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postSendMoney})=> {
            // navigation.pop(); // remove TPIN/OTP Validator Screen;
            setWalletinfoParams(postSendMoney)
            setSuccessModalVisible(true)
        },
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert 
            })
        }
    })


    const reviewAndConfirm = async ()=> {
        const checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
            amount,
            mobileNumber: recipientDetails.mobileNumber,
            setErrorMessage: (value)=> {
                if(errorAmountMessage == ""){
                    setErrorAmountMessage(value)
                    if(value != "") setSwipeEnabled(false)
                }
            }
        })

        if(!checkLimit) return;

        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            event: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Swipe to Send ${tokwaAccount.wallet.currency.code} ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                note: note,
                recipient: {
                    name: `${recipientDetails.person}`,
                    mobileNo: recipientDetails.mobileNumber,
                },
            }
        })
    }

    const Proceed = ({pinCode = null , Otp = null , data = null})=> {
        const { requestSendMoneyId } = data
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

    }

    return (
       <>
        <AlertOverlay visible={requestLoading || loading}/>
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount}
                note={note} 
                recipient={{
                    name: `${recipientDetails.person}`,
                    mobileNo: recipientDetails.mobileNumber
                }}
                walletinfoParams={walletinfoParams}
            />
                 {   swipeEnabled && proceed && isCertify
                     ? <YellowButton label="Proceed" onPress={reviewAndConfirm}/>
                     : <DisabledButton label="Proceed" />
                 }
       </>
    )
}
