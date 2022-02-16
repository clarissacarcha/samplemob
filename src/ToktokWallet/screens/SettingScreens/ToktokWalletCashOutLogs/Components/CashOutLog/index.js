import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat ,MaskLeftZero } from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

export const CashOutLog = ({
    item,
    tokwaAccount,
    index
})=>{
    const [info,setInfo] = useState({})
    const [openModal,setOpenModal] = useState(false)

    let status
    switch (item.status) {
        case "0":
            status = "Pending"
            break;
        case "1":
            status = "Processed"
            break
        case "2":
            status = "Pending"
            break
        case "3":
            status = "Rejected"
            break
        default:
            status = "Rejected"
            break;
    }

    // const refNo = MaskLeftZero(item.id)
    const transaction = item.transaction
    const requestNo = item.referenceNumber ? item.referenceNumber : item.refNo
    const refNo = transaction?.refNo ? transaction.refNo : MaskLeftZero(item.id)
    const refDate = transaction ? moment(transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A') : moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')
    const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(+item.amount + +item.providerServiceFee + +item.systemServiceFee)}`
    const convenienceFee =  `${numberFormat(+item.providerServiceFee + +item.systemServiceFee)}`
    const provider = item.provider.name
    let phrase = provider
    if(provider == "InstaPay" || provider == "PesoNet"){
        phrase = "Other Banks"
    }

    const showDetails = ()=>{
        setInfo({
            refNo,
            refDate,
            name: "Fund Transfer",
            phrase,
            amount: transactionAmount,
            convenienceFee,
            status,
            details: item.details,
            requestNo
        })
        setOpenModal(true);
    }

    const onthrottledPress = useThrottle(showDetails,2000)

  
    return (
        <>
        <Details
            transaction={info}
            visible={openModal}
            setVisible={setOpenModal}
        />
        <TouchableOpacity
            style={styles.transaction}
            onPress={onthrottledPress}
        >
            <View style={styles.transactionDetails}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Request # {requestNo}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.M,marginTop: 0,fontFamily: FONT.REGULAR}}>{status}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={{color: "#FCB91A",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
            </View>
        </TouchableOpacity>
        </>
    )
}


const styles = StyleSheet.create({
    transaction: {
        paddingVertical: 10,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection: "row"
    },
    transactionIcon: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    }
})