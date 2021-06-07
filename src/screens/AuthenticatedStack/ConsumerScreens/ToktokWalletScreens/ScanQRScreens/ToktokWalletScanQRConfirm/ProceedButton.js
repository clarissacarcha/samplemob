import React, {useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Image, Dimensions} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { POST_FUND_TRANSFER } from '../../../../../../graphql/toktokwallet'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'

//SELF IMPORTS
import SuccessfulModal from '../../SendMoneyScreens/ToktokWalletSendMoney/SuccessfulModal'
import { YellowButton } from '../../../../../../revamp'
import { AlertOverlay } from '../../../../../../components'
import {DisabledButton, SwipeProceedButton , EnterPinCode} from '../../Components'

const {width,height} = Dimensions.get("window")

const ProceedButton = ({
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

    const [postFundTransfer , {data ,error ,loading}] = useMutation(POST_FUND_TRANSFER, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0].message == "Wallet Hold"){
                setOpenPinCode(false)
                navigation.navigate("ToktokWalletHomePage")
                navigation.replace("ToktokWalletHomePage")
                return navigation.push("ToktokWalletRestricted", {component: "onHold"})
            }

            if(graphQLErrors[0].message == "Invalid Pincode"){
                return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
            }
            setOpenPinCode(false)
            onErrorAlert({alert,error})
            return navigation.pop()
        },
        onCompleted: ({postFundTransfer})=> {
            console.log(JSON.stringify(postFundTransfer))
            setOpenPinCode(false)
            setWalletinfoParams(postFundTransfer)
            setSuccessModalVisible(true)
        }
    })


    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        setPinCodeAttempt(6)
        return setOpenPinCode(true)
        //return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer})
    }

    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
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

    const Proceed = (pinCode)=> {
        postFundTransfer({
            variables: {
                input: {
                    amount: +amount,
                    note: note,
                    destinationMobileNo: recipientInfo.mobileNumber,
                    pinCode: pinCode
                }
            },
        })
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
                    name: `${recipientInfo.person.firstName} ${recipientInfo.person.lastName}`,
                    mobileNo: recipientInfo.mobileNumber
                }}
                walletinfoParams={walletinfoParams}
            />
            <View style={styles.container}>
                    {/* <SwipeProceedButton
                        enabled={swipeEnabled}
                        title={`Pay PHP ${amount != "" ? numberFormat(amount) : "0"}`}
                        onSwipeFail={onSwipeFail}
                        onSwipeSuccess={onSwipeSuccess}
                    /> */}
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

export default ProceedButton