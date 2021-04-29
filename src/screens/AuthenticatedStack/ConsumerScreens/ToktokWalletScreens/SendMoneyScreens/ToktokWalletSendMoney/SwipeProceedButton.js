import React, {useState , useEffect , useRef} from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import { numberFormat } from '../../../../../../helper';
import {useMutation} from '@apollo/react-hooks'
import {CLIENT,PATCH_FUND_TRANSFER} from '../../../../../../graphql'

import {useNavigation} from '@react-navigation/native'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'
import { BlackButton, OrangeButton, YellowButton } from '../../../../../../revamp';
import ConfirmBottomSheet from '../../Components/ConfirmBottomSheet'
import { BUTTON_HEIGHT, FONT_MEDIUM, SIZES } from '../../../../../../res/constants';

//SELF IMPORTS
import ConfirmModalContent from './ConfirmModalContent'
import SuccessfulModal from './SuccessfulModal'

const SwipeProceedButton = ({amount, note, swipeEnabled , session, recipientDetails})=> {

    const navigation = useNavigation()
    const alert = useAlert()
    const bottomSheetRef = useRef()

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
        bottomSheetRef.current.snapTo(0)
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

            <View style={{height: 60,paddingHorizontal: 10}}>
            {
                swipeEnabled
                ?   <YellowButton label="Send" onPress={()=>bottomSheetRef.current.snapTo(1)}/>
                : <View style={{width: "100%", height: BUTTON_HEIGHT,justifyContent:"center",alignItems: "center", backgroundColor:"gray",borderRadius: 5}}>
                        <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,color:"white"}}>Send</Text>
                  </View>
            }
          </View>

            <ConfirmBottomSheet
                 bottomSheetRef={bottomSheetRef}
                 headerTitle="Review and Confirm" 
                 btnLabel="Confirm"
                 SwipeButtonEnabled
                 SwipeButtonArgs={
                  {
                    enabled: swipeEnabled,
                    title: `Swipe to send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
                    onSwipeFail: onSwipeFail,
                    onSwipeSuccess: onSwipeSuccess
                  }
                 }
            >
                    <ConfirmModalContent amount={amount} recipientDetails={recipientDetails} />
            </ConfirmBottomSheet>
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