import React, { useState } from 'react'
import moment from 'moment'
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native'
import { COLOR, COLORS, FONTS, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants';
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../helper';

//SELF IMPORTS
import { TransactionDetails } from './TransactionDetails'

export const WalletLog = ({transactionDate , transactionItems ,index , itemsLength }) => {

    const session = useSelector(state=>state.session)
    const [transactionVisible,setTransactionVisible] = useState(false)
    const [transactionInfo,setTransactionInfo] = useState({
        refNo: "",
        refDate: "",
        label: "",
        phrase: "",
        amount: "",
    })

    const dateValue = moment(transactionDate).tz("Asia/Manila").format("YYYY-MM-DD");
    const phTodayDate = moment().tz("Asia/Manila").format("YYYY-MM-DD");
    const phYesterdayDate = moment().subtract(1,"days").tz("Asia/Manila").format("YYYY-MM-DD");
    let datedisplay = ''
    if(dateValue == phTodayDate){
      datedisplay = "Today"
    }else if(dateValue == phYesterdayDate){
        datedisplay = "Yesterday"
    }else{
        datedisplay = moment(transactionDate).tz("Asia/Manila").format('MMM DD YYYY');
    }

    const ViewTransactionDetails = (transaction , title, phrase , referenceDate , transactionAmount) => {
        setTransactionVisible(true)
        setTransactionInfo({
            refNo: transaction.referenceNumber,
            refDate: referenceDate,
            label: title,
            phrase: phrase,
            amount: transactionAmount,
        })
        console.log(transaction.referenceNumber)
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
            <View style={[styles.transactionLogsContainer, {marginBottom: index == itemsLength - 1 ? 100 : 0}]}>
                { transactionItems.length > 0 && <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>{datedisplay}</Text> }
            {
                transactionItems.map((item)=>{

                    let icon , title , status , phrase , amountcolor = "black", amountprefix , sender = "" , recipient = ""
                    title = item.logType.label
                    amountcolor = item.sourceUserId == session.user.id ? "red" : "green"
                    amountprefix = item.sourceUserId == session.user.id ? "-" : "+"

                    switch(item.status){
                        case 0:
                            status = "Pending"
                            break
                        case 1:
                            status ="Success"
                            break
                        case 2:
                            status = "Rejected"
                            break
                        default:
                            break
                    }

                    // Sender
                    if(item.sourceInfo.firstName != null) sender = `${item.sourceInfo.firstName} ${item.sourceInfo.lastName}`
                    if(item.sourceInfo.internalAccount != null) sender = `${item.sourceInfo.internalAccount}`
                    if(item.sourceInfo.enterpriseAccount != null) sender = `${item.sourceInfo.enterpriseAccount}`
                 

                    // Recipient
                    if(item.destinationInfo.firstName != null) recipient = `${item.destinationInfo.firstName} ${item.destinationInfo.lastName}`
                    if(item.destinationInfo.internalAccount != null) recipient = `${item.destinationInfo.internalAccount}`
                    if(item.destinationInfo.enterpriseAccount != null) recipient = `${item.destinationInfo.enterpriseAccount}`

                    // Delivery
                    if(item.delivery != null){
                        sender = `${item.delivery.deliveryId}`
                        recipient = sender
                    }
                    

                    phrase = item.sourceUserId == session.user.id ? `${item.logType.sourcePhrase.replace("[:replace]",recipient)}` : `${item.logType.destinationPhrase.replace("[:replace]",sender)}`
                    const referenceDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
                    const transactionAmount = `${amountprefix} PHP ${numberFormat(item.amount)}`
    
                    return (
                        <TouchableOpacity onPress={()=>ViewTransactionDetails(item , title , phrase, referenceDate , transactionAmount)} style={styles.transaction}>
                            <View style={styles.transactionDetails}>
                                {/* <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{title} <Text style={{fontFamily: FONT_LIGHT,fontSize: 10}}> ( {status} )</Text></Text> */}
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>{title}</Text>
                                <Text style={{color: "#929191",fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>{phrase}</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR , color: amountcolor}}>{transactionAmount}</Text>
                                <Text style={{color: "#929191",fontSize: SIZES.S,fontFamily: FONTS.REGULAR, alignSelf: "flex-end"}}>{referenceDate}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    transactionLogsContainer: {
        marginVertical: 10
    },
    transaction: {
        paddingVertical: 12,
        borderBottomColor:"#F4F4F4",
        borderBottomWidth: 1,
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
    }
})
