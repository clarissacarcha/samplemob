import React , {useState} from 'react'
import { numberFormat } from 'toktokwallet/helper'
import { YellowButton } from 'src/revamp'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_FUND_TRANSFER } from 'toktokwallet/graphql'
import { DisabledButton , EnterPinCode } from 'toktokwallet/components'
import { TransactionUtility } from 'toktokwallet/util/TransactionUtility'
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

    const [postFundTransfer , {data ,error , loading }] = useMutation(POST_FUND_TRANSFER, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                alert,
                error,
                navigation,
                onErrorAlert,
                setOpenPinCode,
                setPinCodeAttempt
            })
        },
        onCompleted: ({postFundTransfer})=> {
            console.log(JSON.stringify(postFundTransfer))
            setOpenPinCode(false)
            setWalletinfoParams(postFundTransfer)
            setSuccessModalVisible(true)
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

    const Proceed = (pinCode)=> {
        postFundTransfer({
            variables: {
                input: {
                    amount: +amount,
                    note: note,
                    destinationMobileNo: recipientDetails.mobileNumber,
                    pinCode: pinCode
                }
            },
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        setPinCodeAttempt(6)
        return setOpenPinCode(true)
        //return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer , callBackFunction: Proceed , loading: loading, pinRemainingCodeAttempt: pinCodeAttempt})
    }

    return (
       <>
        
        <EnterPinCode 
            visible={openPinCode} 
            setVisible={setOpenPinCode} 
            loading={loading}
            pinCodeAttempt={pinCodeAttempt}
            callBackFunc={Proceed}
        >
            <AlertOverlay visible={loading} />
        </EnterPinCode>
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
