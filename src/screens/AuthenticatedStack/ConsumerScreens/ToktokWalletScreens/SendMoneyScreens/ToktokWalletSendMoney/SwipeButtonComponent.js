import React, {useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Image, Dimensions} from 'react-native'
import SwipeButton from 'rn-swipe-button'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { BUTTON_HEIGHT, COLORS, FONTS, NUMBERS, SIZES } from '../../../../../../res/constants'
import { numberFormat } from '../../../../../../helper'
import {useMutation} from '@apollo/react-hooks'
import {CLIENT,PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

const {width,height} = Dimensions.get("window")

const thumbIconComponent = ()=> (
    <View style={{...NUMBERS.SHADOW}}>
        <FIcon5 name="chevron-right" size={15}/>
    </View>
)

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
                    <SwipeButton
                            disabled={!swipeEnabled}
                            title={`Pay PHP ${amount != "" ? numberFormat(amount) : "0"}`}
                            onSwipeFail={onSwipeFail}
                            onSwipeSuccess={onSwipeSuccess}
                            containerStyles={styles.swipeContainer}
                            // width={width - 50}
                            width={"90%"}
                            swipeSuccessThreshold={100}
                            titleStyles={{
                                fontSize: SIZES.M,
                                fontFamily: FONTS.BOLD,
                                paddingLeft: 20,
                            }}
                            titleColor={COLORS.MEDIUM}
                            railBackgroundColor="#F7F7FA"
                            railBorderColor="#F7F7FA"
                            railStyles={{
                                    backgroundColor:COLORS.YELLOW,
                                    borderWidth: 0,
                                    // ...NUMBERS.SHADOW,
                            }}
                            thumbIconBackgroundColor="white"
                            thumbIconBorderColor="#F7F7FA"
                            thumbIconStyles={{
                                borderColor:"yellow",
                                borderWidth: 0,
                            }}
                            height={BUTTON_HEIGHT}
                            thumbIconComponent={thumbIconComponent}
                            resetAfterSuccessAnimDelay={0}
                            resetAfterSuccessAnimDuration={0}
                            shouldResetAfterSuccess={true}
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
    swipeContainer: {
        alignSelf:"center",
        marginBottom: 0,
    },
})

export default SwipeButtonComponent