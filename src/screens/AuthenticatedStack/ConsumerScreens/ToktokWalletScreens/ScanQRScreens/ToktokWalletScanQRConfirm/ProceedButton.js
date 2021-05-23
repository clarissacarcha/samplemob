import React, {useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Image, Dimensions} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { POST_FUND_TRANSFER } from '../../../../../../graphql/toktokwallet'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'
import {DisabledButton, SwipeProceedButton} from '../../Components'

//SELF IMPORTS
import SuccessfulModal from '../../SendMoneyScreens/ToktokWalletSendMoney/SuccessfulModal'
import { YellowButton } from '../../../../../../revamp'

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

    const [postFundTransfer] = useMutation(POST_FUND_TRANSFER, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        variables: {
            input: {
                amount: +amount,
                note: note,
                destinationMobileNo: recipientInfo.mobileNumber
            }
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
            navigation.pop()
        },
        onCompleted: ({postFundTransfer})=> {
            console.log(JSON.stringify(postFundTransfer))
            setWalletinfoParams(postFundTransfer)
            setSuccessModalVisible(true)
        }
    })


    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer})
    }

    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Pay PHP ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                recipient: {
                    name: `${recipientInfo.person.firstName} ${recipientInfo.person.lastName}`,
                    mobileNo: recipientInfo.mobileNumber
                }
            }
        })
    }


    return (
        <>
            <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
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