import React, { useState } from 'react'
import moment from 'moment'
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper';
import { useSelector } from 'react-redux';

import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


//SELF IMPORTS
import { TransactionDetails } from './TransactionDetails'

export const WalletLog = ({item ,index , itemsLength }) => {

    const tokwaAccount = useSelector(state=>state.toktokWallet)

    const [transactionVisible,setTransactionVisible] = useState(false)
    const [transactionInfo,setTransactionInfo] = useState({
        refNo: "",
        refDate: "",
        label: "",
        phrase: "",
        amount: "",
        displayNumber: "",
    })

    const ViewTransactionDetails = ({item , title, phrase , referenceDate , transactionAmount, displayNumber, externalReferenceNumber , deliveryId, cashOutDisplayInformations,cashInMobileNumber,externalDetails}) => {
        setTransactionVisible(true)
        setTransactionInfo({
            refNo: MaskLeftZero(item.id),
            refDate: referenceDate,
            label: title,
            phrase: phrase,
            amount: transactionAmount,
            displayNumber: displayNumber,
            externalReferenceNumber: externalReferenceNumber,
            deliveryId: deliveryId,
            cashOutDisplayInformations: cashOutDisplayInformations,
            cashInMobileNumber: cashInMobileNumber,
            externalDetails: externalDetails
        })
    }

    // let title = item.externalName ? item.externalName : item.transactionType.name
    let title = item.transactionType.name
    const amountcolor = item.sourceWalletId == tokwaAccount.wallet.id ? COLOR.RED : "green"
    const amountprefix = item.sourceWalletId == tokwaAccount.wallet.id ? "-" : "+"
    // const referenceDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const referenceDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const transactionAmount = `${amountprefix} ${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`
    const externalReferenceNumber = item.externalReferenceNumber
    const cashOutDisplayInformations = item.cashOutDisplayInformations
    let cashInMobileNumber = null

    let displayNumber = ""

    if(item.sourceWalletId == tokwaAccount.wallet.id && item.destinationAccount?.mobileNumber){
        displayNumber = item.destinationAccount.mobileNumber
    }

    if(item.sourceWalletId != tokwaAccount.wallet.id && item.sourceAccount?.mobileNumber){
        displayNumber = item.sourceAccount.mobileNumber
    }


    let sourceName , destinationName = ""
    if(item.cashOutId){
        sourceName = ``
        destinationName = ``
        title = item.sourceWalletId == tokwaAccount.wallet.id ? item.transactionType.name : `${item.transactionType.name} Return`
    }else if(item.cashInId){
        sourceName = ``
        destinationName = ``
        cashInMobileNumber = tokwaAccount.mobileNumber
    }else if(item.externalName){
        sourceName = ``
        destinationName = ``
    }else{
        sourceName = `${item.sourcePerson.firstName} ${item.sourcePerson.lastName}`
        destinationName = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    }

    let phrase = ""
    // if(item.externalPhrase){
    //     phrase = `${item.externalPhrase}`
    // }else{
    //     if(item.sourceWalletId == tokwaAccount.wallet.id ){
    //         phrase = `${item.transactionType.sourcePhrase.replace("[:source]",destinationName)}`
    //         phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
    //     }else{
    //         phrase = `${item.transactionType.destinationPhrase.replace("[:source]",sourceName)}`
    //         phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
    //     }
    // }

    if(item.sourceWalletId == tokwaAccount.wallet.id ){
        phrase = `${item.transactionType.sourcePhrase.replace("[:source]",destinationName)}`
        phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
    }else{
        phrase = `${item.transactionType.destinationPhrase.replace("[:source]",sourceName)}`
        phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
    }

    let deliveryId = null
    if(
        item.externalName 
        && item.externalName === "toktok" || item.externalName === "toktok rider" 
        && item.externalPhrase
        && (item.externalPhrase === "earnings" || item.externalPhrase === "payment" || item.externalPhrase === "cancelled"))
    {
        const deliveryPayload = JSON.parse(item.externalPayload)
        deliveryId = deliveryPayload.delivery.deliveryId
    }

    const externalDetails = item.externalDetails

    return (
        <>
            <TransactionDetails 
                visible={transactionVisible}
                setVisible={setTransactionVisible}
                transactionInfo={transactionInfo}
                cashOutDisplayInformations={cashOutDisplayInformations}
                cashInMobileNumber={cashInMobileNumber}
            />

            <TouchableOpacity onPress={()=>ViewTransactionDetails({
                item , 
                title , 
                phrase, 
                referenceDate , 
                transactionAmount, 
                displayNumber ,
                externalReferenceNumber , 
                deliveryId ,
                cashOutDisplayInformations,
                cashInMobileNumber,
                externalDetails
            })} style={styles.transaction}>
                <View style={styles.transactionDetails}>
                    {/* <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{title} <Text style={{fontFamily: FONT_LIGHT,fontSize: 10}}> ( {status} )</Text></Text> */}
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{title}</Text>
                    <Text style={{color: "#929191",fontSize: FONT_SIZE.S,fontFamily: FONT.REGULAR}}>{phrase}</Text>
                </View>
                <View style={styles.transactionAmount}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR , color: amountcolor}}>{transactionAmount}</Text>
                    <Text style={{color: "#929191",fontSize: FONT_SIZE.S,fontFamily: FONT.REGULAR, alignSelf: "flex-end"}}>{referenceDate}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
          
        </>
    )
}

const styles = StyleSheet.create({
    transactionLogsContainer: {
        marginVertical: 10
    },
    transaction: {
        paddingVertical: 12,
        // marginVertical: 5,
        flexDirection: "row",
    },
    transactionIcon: {
        flexBasis: 50,
        alignSelf: "center"
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

