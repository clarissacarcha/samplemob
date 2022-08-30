import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { Separator } from "toktokwallet/components";
import { numberFormat , moderateScale, currencyCode , getHeaderDateTitle} from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

const RenderLowerText = (lowerText)=> {
    return (
        <>
        <Separator/>
        <Text style={styles.dayTitle}>{lowerText}</Text>
        </>
    )
}

export const SendMoneyLog = ({
    item,
    tokwaAccount,
    index,
    data
})=>{
    const [info,setInfo] = useState({})
    const [openModal,setOpenModal] = useState(false)
    const { upperText , lowerText } = getHeaderDateTitle({
        refDate: item?.node?.createdAt,
        data,
        index
    })

    let status
    switch (item?.node?.status) {
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
    const transaction = item?.node
    const refNo = transaction.refNo
    const refDate = moment(transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')
    const transactionAmount = `${currencyCode}${numberFormat(transaction.amount)}`


    const showDetails = ()=>{
        setInfo({
            refNo,
            refDate,
            name: item?.node?.name,
            phrase: item?.node?.phrase,
            amount: transactionAmount,
            status,
            details: item?.node?.details,
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
         {!!upperText && <Text style={styles.dayTitle}>{upperText}</Text>}
        <TouchableOpacity
            style={styles.transaction}
            onPress={onthrottledPress}
        >
            <View style={styles.transactionDetails}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Reference # {refNo}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.S,marginTop: 0,fontFamily: FONT.REGULAR}}>{item?.node?.phrase}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
            </View>
         </TouchableOpacity>
        <View style={{paddingHorizontal: 16}}>
            <View style={styles.divider}/>
        </View>
        {!!lowerText && RenderLowerText(lowerText)}
        </>
    )
}


const styles = StyleSheet.create({
    transaction: {
        paddingVertical: 10,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection: "row",
        padding: 16,
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
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: COLOR.LIGHT,
    },
    dayTitle: {
        fontFamily: FONT.BOLD,
        marginTop: moderateScale(20),
        paddingHorizontal: 16,
    },
})