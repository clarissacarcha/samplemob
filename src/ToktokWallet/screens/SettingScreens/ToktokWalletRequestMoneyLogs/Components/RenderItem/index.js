import React , {useState} from "react";
import {View,Text , TouchableOpacity,StyleSheet} from'react-native'
import moment from "moment";
import {numberFormat} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS 
import Details from "./Details";
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const RenderItem = ({item,index,tokwaAccount})=> {
  
    const [openModal,setOpenModal] = useState(false)
    const [info,SetInfo] = useState({})


    const DestinationPerson = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    const SourcePerson = `${item.sourcePerson.firstName} ${item.sourcePerson.lastName}`
    const isDestination = tokwaAccount.id == item.destinationAccountId
    let status = ""
    let indicator = ""
    let label = ""
    let color = ""
    let person = ""
    let mobileNumber = ""
    switch(item.status){
        case 0:
            status = isDestination ? "Pending request to" : "Pending request from"
            color = COLOR.DARK
            indicator = ""
            person = isDestination ? SourcePerson : DestinationPerson
            mobileNumber = isDestination ? item.sourceAccount.mobileNumber : item.destinationAccount.mobileNumber
            break
        case 1:
            status = isDestination ? "Received from" : "Sent to"
            color = isDestination ? "green" : COLOR.RED
            indicator = isDestination ? "+ " : "- "
            person = isDestination ? SourcePerson : DestinationPerson
            mobileNumber = isDestination ? item.sourceAccount.mobileNumber : item.destinationAccount.mobileNumber
            break
        case 2:
            status = isDestination ? "Declined request by" : "Decline request from"
            color = COLOR.DARK
            indicator = ""
            person = isDestination ? SourcePerson : DestinationPerson
            mobileNumber = isDestination ? item.sourceAccount.mobileNumber : item.destinationAccount.mobileNumber
            break
        case 3:
            status = "Deleted Request to"
            color = COLOR.DARK
            indicator = ""
            person = SourcePerson
            mobileNumber = item.sourceAccount.mobileNumber
            break
        default:
            status = "Successful"
            color = "black"
            break
    }
    const refDate = moment(item.updatedAt).format("MMM D, YYYY hh:mm a")
    const transactionAmount = item.transaction  ?  `${indicator} ${tokwaAccount.wallet.currency.code} ${numberFormat(+item.transaction.amount)}` : null
    const requestedAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(+item.amount)}`
    const openRMDetails = ()=>{
        SetInfo({
            ...item,
            transactionAmount,
            requestedAmount,
            refDate,
            name: "Request Money",
            phrase: `${status} ${person}`,
            refNo: item.transaction ? item.transaction.refNo : null,
            requestNo: item.refNo,
            mobileNumber,
            indicator
        })
        setOpenModal(true)
    }


    return (
        <>
        <Details
            visible={openModal}
            setVisible={setOpenModal}
            transaction={info}
        />
        <TouchableOpacity key={`RM_${index}`} onPress={openRMDetails} style={[styles.card]}>
            <View style={styles.cardContent}>
                <View style={{flex: 1,height:"100%",justifyContent:"flex-start"}}>
                    <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>Request No: {item.refNo}</Text>
                    <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>{status}</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{person}</Text>
                </View>
                <View style={{flex: 1,alignItems:"flex-end"}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color: color}}>{transactionAmount ? transactionAmount : requestedAmount}</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>{refDate}</Text>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S,color:COLOR.YELLOW}}>click to see details</Text>
                </View>
            </View>
            
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 10,
        justifyContent:"center",
        paddingHorizontal: 16,
    },
    cardContent: {
        flexDirection:"row"
    },
})