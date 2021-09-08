import React, {useState} from 'react'
import {View,StyleSheet} from 'react-native'
import { numberFormat } from 'toktokwallet/helper'
import {useMutation} from '@apollo/react-hooks'
import { TransactionUtility } from 'toktokwallet/util'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_REQUEST_SEND_MONEY , POST_SEND_MONEY } from 'toktokwallet/graphql'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import { YellowButton } from 'src/revamp'
import { AlertOverlay } from 'src/components'
import {DisabledButton , EnterPinCode , EnterOtpCode } from 'toktokwallet/components'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

export const ProceedButton = ({
    amount,
    swipeEnabled,
    note,
    recipientInfo
})=> {

    const navigation = useNavigation()
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
                setPinCodeAttempt       
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
                }
            }
        })
    }

    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            event: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
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

    const Proceed = ({pinCode = null , Otp = null})=> {
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
         <AlertOverlay visible={requestLoading}/>
           <EnterPinCode 
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
            >
                <AlertOverlay visible={loading} />
            </EnterOtpCode>
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
                        swipeEnabled
                        ? <YellowButton label="Proceed" onPress={reviewAndConfirm}/>
                        : <DisabledButton label="Proceed"/>
                    }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        paddingHorizontal: 10 
    },
})

