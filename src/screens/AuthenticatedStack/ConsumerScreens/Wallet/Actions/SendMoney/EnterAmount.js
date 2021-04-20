import React, {useEffect, useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { FONT_MEDIUM, FONT_REGULAR , FONT_LIGHT } from '../../../../../../res/constants'
import {CHECK_WALLET_LIMITS} from '../../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'


const EnterAmount = ({walletinfo , setSwipeEnabled , amount , note ,setAmount, setNote , recipientDetails , senderDetails}) => {

    const [errorAmountMessage,setErrorAmountMessage] = useState("")
    const [tempAmount,setTempAmount] = useState("")

    const [checkWalletLimits] = useLazyQuery(CHECK_WALLET_LIMITS, {
        fetchPolicy:"network-only",
        onError: (error)=>{

        },
        onCompleted: (response)=> {

        }
    })

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        setTempAmount(num)
        setAmount(num * 0.01)
    }

    const checkSenderWalletLimitation = ()=> {
        const outgoingRecords = senderDetails.outgoingRecords
        const walletLimit = outgoingRecords.walletlimit


        if(walletLimit.outgoingValueDailyLimit){
            if((outgoingRecords.daily + +amount ) > walletLimit.outgoingValueDailyLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Your daily outgoing wallet limit is reached.")
            }
        }

        if(walletLimit.outgoingValueMonthlyLimit){
            if((outgoingRecords.monthly + +amount ) > walletLimit.outgoingValueMonthlyLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Your monthly outgoing wallet limit is reached.")
            }
        }

        if(walletLimit.outgoingValueAnnualLimit){
            if((outgoingRecords.yearly + +amount ) > walletLimit.outgoingValueAnnualLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Your annual outgoing wallet limit is reached.")
            }
        }

        return
    }

    const checkRecipientWalletLimitation = ()=> {

        const incomingRecords = recipientDetails.incomingRecords
        const walletLimit = incomingRecords.walletlimit

        if(walletLimit.walletSize){
            if((incomingRecords.walletbalance + +amount ) > walletLimit.walletSize){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Recipient wallet size limit is reached.")
            }
        }

        if(walletLimit.incomingValueDailyLimit){
            if((incomingRecords.daily + +amount ) > walletLimit.incomingValueDailyLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Recipient daily incoming wallet limit is reached.")
            }
        }

        if(walletLimit.incomingValueMonthlyLimit){
            if((incomingRecords.monthly + +amount ) > walletLimit.incomingValueMonthlyLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Recipient monthly incoming wallet limit is reached.")
            }
        }

        if(walletLimit.incomingValueAnnualLimit){
            if((incomingRecords.yearly + +amount ) > walletLimit.incomingValueAnnualLimit){
                setSwipeEnabled(false)
                return setErrorAmountMessage("Recipient annual incoming wallet limit is reached.")
            }
        }

        return
    }

    useEffect(()=>{
   
            if(amount >= 1 && amount <= walletinfo.balance){
                setSwipeEnabled(true)
                setErrorAmountMessage("")
                checkSenderWalletLimitation()
                checkRecipientWalletLimitation()
                
            }else if(amount < 1 && amount != ""){
                setSwipeEnabled(false)
                setErrorAmountMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
            }else{
                setSwipeEnabled(false)
                setErrorAmountMessage(amount == "" ? "" : "You do not have enough balance")
            }


        return ()=> {
            setErrorAmountMessage("")
        }
    },[amount,recipientDetails])

    return (
        <>
        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 13}}>Enter Amount</Text>
                    <View style={styles.amount}>
                            <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM,alignSelf:"center"}}>{'\u20B1'} </Text>
                            <TextInput
                                    caretHidden
                                    value={tempAmount}
                                    onChangeText={changeAmount}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="numeric"
                                    returnKeyType="done"
                            />
                            <View style={{fontSize: 12,fontFamily: FONT_REGULAR,paddingVertical: 5,marginLeft: 5,alignSelf: "center",flex: 1}}>
                                <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                            </View>
                    </View>
                    <View>
                        <Text style={{fontFamily:FONT_REGULAR,fontSize: 11,color:"red",marginTop: 5}}>{errorAmountMessage}</Text>
                    </View>

                    <View>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 13}}>Note <Text style={{fontFamily: FONT_REGULAR,fontSize: 11}}>( Optional )</Text></Text>
                        <View style={styles.amount}>
                                <TextInput
                                        value={note}
                                        multiline={true}
                                        height={50}
                                        onChangeText={value=>setNote(value)}
                                        placeholder="Enter note here..." 
                                        returnKeyType="done"
                                        maxLength={60}
                                        style={{fontSize: 12,fontFamily: FONT_REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                                />
                        </View>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 12}}>{note.length}/60</Text>
                </View>
        </>
    )
}

const styles = StyleSheet.create({
     amount: {
        padding: 5,
        width: "100%",
        borderColor: "silver",
        borderWidth: .5,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
    }
})

export default EnterAmount