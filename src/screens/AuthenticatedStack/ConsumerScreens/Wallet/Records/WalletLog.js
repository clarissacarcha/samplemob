import React from 'react'
import moment from 'moment'
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants';
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../helper';

const WalletLog = ({transactionDate , transactionItems ,index , itemsLength }) => {

    const session = useSelector(state=>state.session)

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


    return (
            <View style={[styles.transactionLogsContainer, {marginBottom: index == itemsLength - 1 ? 100 : 0}]}>
                { transactionItems.length > 0 && <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{datedisplay}</Text> }
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
    
    
                    // transaction icons / images
                    switch (item.logType.transferType){
                        case "T":
                            icon = require('../../../../../assets/icons/walletLogTransfer.png') // Fund Transfer
                            break
                        case "CI":
                            icon = require('../../../../../assets/icons/walletLogCashin.png') // Cash in
                            break
                        case "CO":
                            icon = require('../../../../../assets/icons/walletLogTransfer.png') // Cash in
                            break
                        default:
                            icon = require('../../../../../assets/icons/walletDelivery.png') // Delivery
                            break
                    }

                    return (
                        <View style={styles.transaction}>
                            <View style={styles.transactionIcon}>
                                <Image source={icon} style={{height: 30, width: 30}} resizeMode="contain"/>
                            </View>
                            <View style={styles.transactionDetails}>
                                {/* <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{title} <Text style={{fontFamily: FONT_LIGHT,fontSize: 10}}> ( {status} )</Text></Text> */}
                                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{title}</Text>
                                <Text style={{color: "#909294",fontSize: 10,marginTop: 2,fontFamily: FONT_MEDIUM}}>{phrase}</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM , color: amountcolor}}>{amountprefix} {'\u20B1'} {numberFormat(item.amount)}</Text>
                                <Text style={{color: "gray",fontSize: 10,fontFamily: FONT_REGULAR, alignSelf: "flex-end",marginTop: 2}}>{moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
                            </View>
                        </View>
                    )
                })
            }
            </View>
    )
}

const styles = StyleSheet.create({
    transactionLogsContainer: {
        marginVertical: 5
    },
    transaction: {
        padding: 10,
        paddingVertical: 15,
        borderWidth: 0.5 ,
        borderColor:"silver",
        marginVertical: 10,
        borderRadius: 5,
        flexDirection: "row"
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

export default WalletLog