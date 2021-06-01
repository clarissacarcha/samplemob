import React, { useState } from 'react'
import moment from 'moment'
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native'
import {COLOR, FONT , FONT_SIZE} from '../../../../../res/variables';
import { numberFormat } from '../../../../../helper';
import { MaskLeftZero } from '../../../../../util/HelperUtility'
import { useSelector } from 'react-redux';

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
    })

    const ViewTransactionDetails = (transaction , title, phrase , referenceDate , transactionAmount) => {
        setTransactionVisible(true)
        setTransactionInfo({
            refNo: MaskLeftZero(transaction.id),
            refDate: referenceDate,
            label: title,
            phrase: phrase,
            amount: transactionAmount,
        })
    }

    const title = item.externalName ? item.externalName : item.transactionType.name
    const amountcolor = item.sourceWalletId == tokwaAccount.wallet.id ? "red" : "green"
    const amountprefix = item.sourceWalletId == tokwaAccount.wallet.id ? "-" : "+"
    // const referenceDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const referenceDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const transactionAmount = `${amountprefix} ${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`


    let sourceName , destinationName = ""
    if(item.cashOutId){
        sourceName = ``
        destinationName = ``
    }else if(item.cashInId){
        sourceName = ``
        destinationName = ``
    }else if(item.externalName){
        sourceName = ``
        destinationName = ``
    }else{
        sourceName = `${item.sourcePerson.firstName} ${item.sourcePerson.lastName}`
        destinationName = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    }

    let phrase = ""
    if(item.externalPhrase){
        phrase = `${item.externalPhrase}`
    }else{
        if(item.sourceWalletId == tokwaAccount.wallet.id ){
            phrase = `${item.transactionType.sourcePhrase.replace("[:source]",destinationName)}`
            phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
        }else{
            phrase = `${item.transactionType.destinationPhrase.replace("[:source]",sourceName)}`
            phrase = `${phrase.replace("[:amount]",`${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`)}`
        }
    }


    return (
        <>
            <TransactionDetails 
                visible={transactionVisible}
                setVisible={setTransactionVisible}
                refNo={transactionInfo.refNo}
                refDate={transactionInfo.refDate}
                label={transactionInfo.label}
                phrase={transactionInfo.phrase}
                amount={transactionInfo.amount}
            />

            <TouchableOpacity onPress={()=>ViewTransactionDetails(item , title , phrase, referenceDate , transactionAmount)} style={styles.transaction}>
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

