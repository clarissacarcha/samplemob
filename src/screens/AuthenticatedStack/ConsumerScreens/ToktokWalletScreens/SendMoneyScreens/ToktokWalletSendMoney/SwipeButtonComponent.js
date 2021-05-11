import React, {useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Image, Dimensions} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import {useMutation} from '@apollo/react-hooks'
import {CLIENT,PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'
import {SwipeProceedButton} from '../../Components'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

const {width,height} = Dimensions.get("window")


const SwipeButtonComponent = ({
    amount,
    swipeEnabled,
    note,
    session,
    recipientDetails
})=> {

    const navigation = useNavigation()
    const alert = useAlert()
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })

    const [patchFundTransfer] = useMutation(PATCH_FUND_TRANSFER, {
        variables: {
            input: {
                amount: +amount,
                note: note,
                sourceUserId: session.user.id,
                destinationUserId: recipientDetails.id,
            }
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
            navigation.pop()
        },
        onCompleted: (response)=> {
            setWalletinfoParams(response.patchFundTransfer.walletLog)
            setSuccessModalVisible(true)
        }
    })


    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: patchFundTransfer})
    }

    return (
        <>
            <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
                recipient={{
                    name: `${recipientDetails.person.firstName} ${recipientDetails.person.middleName ? recipientDetails.person.middleName + " " : ""}${recipientDetails.person.lastName}`,
                    mobileNo: recipientDetails.username
                }}
                walletinfoParams={walletinfoParams}
            />
            <View style={styles.container}>
                    <SwipeProceedButton 
                        enabled={swipeEnabled} 
                        title={`Pay PHP ${amount != "" ? numberFormat(amount) : "0"}`} 
                        onSwipeFail={onSwipeFail}
                        onSwipeSuccess={onSwipeSuccess}
                    />
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

export default SwipeButtonComponent