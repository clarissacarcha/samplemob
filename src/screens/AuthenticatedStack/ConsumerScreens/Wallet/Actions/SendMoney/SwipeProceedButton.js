import React, {useState , useEffect} from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import { numberFormat } from '../../../../../../helper';
import { FONT_MEDIUM } from '../../../../../../res/constants';
import {useMutation} from '@apollo/react-hooks'
import {CLIENT,PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import SuccessfulModal from './SuccessfulModal'
import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'

const SwipeProceedButton = ({amount, note, swipeEnabled , session, recipientDetails})=> {

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
        return navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: patchFundTransfer})
    }

    const thumbIconComponent = ()=> (
        <View>
            <Image style={{height: 15,width: 20}} source={require('../../../../../../assets/icons/walletSwipenext.png')}/>
        </View>
    )

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
        <SwipeButton 
            //enableReverseSwipe={true}
                disabled={!swipeEnabled}
                disabledRailBackgroundColor="dimgray"
                containerStyles={styles.swipeContainer}
                width={250}
                title={`Swipe to Send ${'\u20B1'} ${amount != "" ? numberFormat(amount) : "0"}`}
                titleStyles={{
                    fontSize: 12,
                    fontFamily: FONT_MEDIUM,
                    paddingLeft: 20,
                }}
                titleColor="white"
                railBackgroundColor="black"
                railStyles={{
                    backgroundColor: "white",
                    margin: 0,
                    borderColor: "black"
                }}
                thumbIconBackgroundColor="white"
                thumbIconBorderColor="black"
                thumbIconStyles={{
                    borderWidth: 1,
                    borderColor:"black"
                }}
                thumbIconComponent={thumbIconComponent}
                onSwipeFail={onSwipeFail}
                onSwipeSuccess={onSwipeSuccess}
                resetAfterSuccessAnimDelay={0}
                resetAfterSuccessAnimDuration={0}
                shouldResetAfterSuccess={true}
            />
        </>
    )
}

const styles = StyleSheet.create({
    swipeContainer: {
        alignSelf:"center",
        marginBottom: 0,
     },
})

export default SwipeProceedButton