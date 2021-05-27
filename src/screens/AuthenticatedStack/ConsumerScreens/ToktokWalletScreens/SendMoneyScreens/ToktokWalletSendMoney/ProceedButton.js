import React , {useState} from 'react'
import {View} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { YellowButton } from '../../../../../../revamp'
import { DisabledButton } from '../../Components'
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../../util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT,PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import { POST_FUND_TRANSFER } from '../../../../../../graphql/toktokwallet'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'


const ProceedButton = ({swipeEnabled , navigation , amount , note , session , recipientDetails })=> {

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
                destinationMobileNo: recipientDetails.mobileNumber
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

    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                recipient: {
                    name: `${recipientDetails.person.firstName} ${recipientDetails.person.middleName ? recipientDetails.person.middleName + " " : ""}${recipientDetails.person.lastName}`,
                    mobileNo: recipientDetails.mobileNumber
                }
            }
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer})
    }

    return (
       <>
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
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

export default ProceedButton