import React, { useState , useEffect } from "react";
import { View , Text , StyleSheet ,TouchableOpacity,ScrollView} from 'react-native'
import { Separator , CheckIdleState , DisabledButton} from 'toktokwallet/components'
import { numberFormat } from 'toktokwallet/helper'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { useThrottle } from 'src/hooks'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_REQUEST_APPROVE_REQUEST_MONEY,POST_APPROVED_REQUEST_MONEY } from 'toktokwallet/graphql'
import { AlertOverlay } from 'src/components'
import { TransactionUtility } from 'toktokwallet/util'
import { useAccount } from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants'

// SELF IMPORTS
import {
    CancelButton,
    DeclineModal,
    EnterAmount,
    RequestInfo,
    SuccessfulModal,
    WalletBalance
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const ToktokWalletRequestMoneyViewDetails = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })
    const alert = useAlert();
    const { refreshWallet , tokwaAccount } = useAccount();
    const requestMoney = route?.params?.requestMoney;
    const enableCancel = route?.params?.enableCancel;
    const [amount,setAmount] = useState(requestMoney.amount.toString())
    const [note,setNote] = useState("")
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: "",
        amount: ""
    })
    const [declineModal,setDeclineModal] = useState(false)
    const [enabled,setEnabled] = useState(false)

    useEffect(()=>{
        refreshWallet()
    },[])

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
                    amount: +amount
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
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>

                    <RequestInfo
                        label="Requester Name"
                        value={`${requestMoney.destinationPerson.firstName} ${requestMoney.destinationPerson.lastName}`}
                    />

                    <RequestInfo
                        label="Mobile Number"
                        value={requestMoney.destinationAccount.mobileNumber}
                    />

                    <RequestInfo
                        label="Amount Requested"
                        value={`${tokwaAccount.wallet.currency.code} ${numberFormat(requestMoney.amount)}`}
                    />

                    {
                        requestMoney.destinationRemarks != "" &&
                        <RequestInfo
                            label="Note"
                            value={requestMoney.destinationRemarks}
                        />
                    }

                {
                    !enableCancel && 
                    <>
                        <EnterAmount
                                amount={amount}
                                setAmount={setAmount}
                                setEnabled={setEnabled}
                                tokwaAccount={tokwaAccount}
                        />

                        <WalletBalance 
                            tokwaAccount={tokwaAccount}
                            navigation={navigation}
                            amount={amount}
                        />
                    </>
                }
                  
                </ScrollView>
                <View style={styles.actionBtns}>
                   {
                       enableCancel 
                       ? <CancelButton/>
                       : <>
                            <TouchableOpacity onPress={throttledDeclined} style={[styles.btn, {backgroundColor:"#CBCBCB",marginRight: 10}]}>
                                <Text style={[ styles.label ]}>Decline</Text>
                            </TouchableOpacity>
                                {
                                    enabled 
                                    ? <TouchableOpacity onPress={throttledSend} style={[styles.btn, {backgroundColor:COLOR.YELLOW,marginLeft: 10}]}>
                                        <Text style={[ styles.label ]}>Send</Text>
                                    </TouchableOpacity>
                                :    <View style={{justifyContent:"center",alignItems:"center",height: 50,backgroundColor: "#FDBA1C",opacity: 0.5, borderRadius: 5,flex: 1}}>
                                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,color:"gray"}}>Send</Text>
                                    </View>
                                }
                       </>
                   }
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

