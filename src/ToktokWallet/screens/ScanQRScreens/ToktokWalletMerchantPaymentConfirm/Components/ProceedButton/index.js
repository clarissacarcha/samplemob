import React, {useState} from 'react'
import {View,StyleSheet} from 'react-native'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import {useMutation} from '@apollo/react-hooks'
import { TransactionUtility } from 'toktokwallet/util'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_REQUEST_MERCHANT_PAYMENT,POST_MERCHANT_PAYMENT } from 'toktokwallet/graphql'
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
    serviceFee,
    swipeEnabled,
    setSwipeEnabled,
    note,
    isCertify,
    setErrorMessage,
    errorMessage,
    tokwaAccount,
    merchant,
    branch,
    terminal,
    qrCode
})=> {

    const prompt = usePrompt()
    const navigation = useNavigation()
    const alert = useAlert()
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [transactionInfo,setTransactionInfo] = useState(null)

    const [postRequestMerchantPayment , {loading: requestLoading}] = useMutation(POST_REQUEST_MERCHANT_PAYMENT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestMerchantPayment})=> {
            return navigation.navigate("ToktokWalletTPINValidator", {
                callBackFunc: Proceed,
            })
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

    const [postMerchantPayment , {data ,error, loading }] = useMutation(POST_MERCHANT_PAYMENT , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postMerchantPayment})=> {
            setTransactionInfo(postMerchantPayment)
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
        postRequestMerchantPayment()
    }

    const reviewAndConfirm = async ()=> {


        const checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
            amount,
            setErrorMessage: (value)=> {
                if(errorMessage == ""){
                    setErrorMessage(value)
                    if(value != "") setSwipeEnabled(false)
                }
            }
        })

        if(!checkLimit) return;
        
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Pay QR",
            event: "merchantPayment",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Swipe to Pay PHP ${amount != "" ? numberFormat(amount + serviceFee) : "0"}`,
            data: {
                amount,
                serviceFee,
                note,
                tokwaAccount,
                merchant,
                branch,
                terminal,
                qrCode
            }
        })
    }

    const Proceed = ({pinCode = null , Otp = null , data = null})=> {
        postMerchantPayment({
            variables: {
                input: {
                    TPIN: pinCode,
                    qrCode: qrCode,
                    amount: +amount,
                    serviceFee: +serviceFee,
                    note
                }
            }
        })
    }

    return (
        <>
         <AlertOverlay visible={requestLoading || loading}/>
           {
               transactionInfo &&
               <SuccessfulModal 
                    successModalVisible={successModalVisible}
                    transactionInfo={transactionInfo}
                    note={note}
                    merchant={merchant}
                    branch={branch}
                    terminal={terminal}
                    tokwaAccount={tokwaAccount}
                    amount={amount}
                    serviceFee={serviceFee}
                />
           }
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

