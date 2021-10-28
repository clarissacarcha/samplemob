import React, { useState } from "react";
import { View , Text , StyleSheet ,TouchableOpacity} from 'react-native'
import { Separator , CheckIdleState} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { useThrottle } from 'src/hooks'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_REQUEST_APPROVE_REQUEST_MONEY,POST_APPROVED_REQUEST_MONEY } from 'toktokwallet/graphql'
import { AlertOverlay } from 'src/components'
import { TransactionUtility } from 'toktokwallet/util'
import CONSTANTS from 'common/res/constants'

// SELF IMPORTS
import {
    DeclineModal,
    SuccessfulModal
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const ToktokWalletRequestMoneyViewDetails = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })
    const alert = useAlert();
    const requestMoney = route.params.requestMoney;
    const [amount,setAmount] = useState(requestMoney.amount)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: "",
        amount: ""
    })
    const [declineModal,setDeclineModal] = useState(false)

    const [postRequestApproveRequestMoney, {loading}] = useMutation(POST_REQUEST_APPROVE_REQUEST_MONEY, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error) => onErrorAlert({alert,error}),
        onCompleted: ({postRequestApproveRequestMoney})=> {
            const { validator , requestRequestMoneyId } = postRequestApproveRequestMoney
            const screen = validator == "TPIN" ? "ToktokWalletTPINValidator" : "ToktokWalletOTPValidator"
            return navigation.navigate(screen, {
                callBackFunc: Proceed,
                resendRequest: send ,
                data: {
                    requestRequestMoneyId: requestRequestMoneyId
                }
            })
        }
    })

    const [postApprovedRequestMoney, {loading: approvedLoading}] = useMutation(POST_APPROVED_REQUEST_MONEY , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postApprovedRequestMoney})=> {
            setWalletinfoParams(postApprovedRequestMoney)
            setSuccessModalVisible(true)
        },
        onError: (error)=>{
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                alert,
                onErrorAlert,  
            })
        }
    })

    const decline = ()=> {
        setDeclineModal(true)
    }
    const send = ()=> {
        postRequestApproveRequestMoney({
            variables: {
                input: {
                    requestMoneyId: requestMoney.id,
                }
            }
        })
    }

    const Proceed = ({pinCode = null , Otp = null , data = null})=> {
        const { requestRequestMoneyId } = data
        postApprovedRequestMoney({
            variables: {
                input: {
                    requestRequestMoneyId,
                    OTP: Otp,
                    TPIN: pinCode
                }
            }
        })
    }

    const throttledDeclined = useThrottle(decline , 2000)
    const throttledSend = useThrottle(send , 2000)

    return (
        <CheckIdleState>
            <AlertOverlay visible={loading || approvedLoading}/>
            <SuccessfulModal
                visible={successModalVisible}
                requestMoney={requestMoney}
                walletinfoParams={walletinfoParams}
            />
            <DeclineModal
                visible={declineModal}
                setVisible={setDeclineModal}
                requestMoney={requestMoney}
                amount={amount}
            />
            <Separator/>
            <View style={styles.container}>
                <View style={{flex: 1}}>

                </View>
                <View style={styles.actionBtns}>
                    <TouchableOpacity onPress={throttledDeclined} style={[styles.btn, {backgroundColor:"#CBCBCB",marginRight: 10}]}>
                        <Text style={[ styles.label ]}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={throttledSend} style={[styles.btn, {backgroundColor:COLOR.YELLOW,marginLeft: 10}]}>
                        <Text style={[ styles.label ]}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    actionBtns: {
        height: 70,
        justifyContent:"flex-end",
        flexDirection:'row',
        alignItems:"flex-end"
    },
    btn: {
        height: SIZE.FORM_HEIGHT,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    label: {
        color: 'black',
        fontSize:FONT_SIZE.L,
        paddingHorizontal: 10,
        fontFamily: FONT.BOLD,
      },
})

