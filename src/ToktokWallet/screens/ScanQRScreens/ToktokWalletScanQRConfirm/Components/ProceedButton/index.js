import React, {useState} from 'react'
import {View,StyleSheet} from 'react-native'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import {useMutation} from '@apollo/react-hooks'
import { TransactionUtility } from 'toktokwallet/util'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_REQUEST_SEND_MONEY , POST_SEND_MONEY } from 'toktokwallet/graphql'
import {useNavigation} from '@react-navigation/native'
import {useAlert, usePrompt} from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility'
import { YellowButton } from 'src/revamp'
import { AlertOverlay } from 'src/components'
import {DisabledButton , ValidatorScreen } from 'toktokwallet/components'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

export const ProceedButton = ({
    amount,
    swipeEnabled,
    setSwipeEnabled,
    note,
    recipientInfo,
    isCertify,
    setErrorMessage,
    errorMessage,
})=> {

    const prompt = usePrompt()
    const navigation = useNavigation()
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
                }
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


    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        postRequestSendMoney({
            variables: {
                input: {
                    amount: +amount,
                    note: note,
                    destinationMobileNo: recipientInfo.mobileNumber,
                    isScanQr: true
                }
            }
        })
    }

    const reviewAndConfirm = async ()=> {


        const checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
            amount,
            mobileNumber: recipientInfo.mobileNumber,
            setErrorMessage: (value)=> {
                if(errorMessage == ""){
                    setErrorMessage(value)
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
            swipeTitle: `Swipe to Send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                note: note,
                recipient: {
                    name: `${recipientInfo.person.firstName} ${recipientInfo.person.lastName}`,
                    mobileNo: recipientInfo.mobileNumber
                }
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

    return (
        <>
         <AlertOverlay visible={requestLoading || loading}/>
            <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
                note={note}
                recipient={{
                    name: `${recipientInfo.person.firstName} ${recipientInfo.person.lastName}`,
                    mobileNo: recipientInfo.mobileNumber
                }}
                walletinfoParams={walletinfoParams}
            />
            <View style={styles.container}>
                    {
                        swipeEnabled && isCertify
                        ? <YellowButton label="Confirm" onPress={reviewAndConfirm}/>
                        : <DisabledButton label="Confirm"/>
                    }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
    },
})

