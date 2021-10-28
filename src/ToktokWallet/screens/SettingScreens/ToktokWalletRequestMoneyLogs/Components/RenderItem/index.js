import React from "react";
import {View,Text , TouchableOpacity,StyleSheet} from'react-native'
import moment from "moment";
import {numberFormat} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const RenderItem = ({item,index,tokwaAccount})=> {
    const openRMDetails = ()=>{
       
    }

    const DestinationPerson = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    const SourcePerson = `${item.sourcePerson.firstName} ${item.sourcePerson.lastName}`
    const isDestination = tokwaAccount.id == item.destinationAccountId
    let status = ""
    let indicator = ""
    let label = ""
    let color = ""
    let person = ""
    switch(item.status){
        case 0:
            status = isDestination ? "Pending request to" : "Pending request from"
            color = COLOR.DARK
            indicator = ""
            person = isDestination ? SourcePerson : DestinationPerson
            break
        case 1:
            status = isDestination ? "Received from" : "Sent to"
            color = isDestination ? "green" : COLOR.RED
            indicator = isDestination ? "+ " : "- "
            person = isDestination ? SourcePerson : DestinationPerson
            break
        case 2:
            status = isDestination ? "Declined request by" : "Decline request from"
            color = COLOR.DARK
            indicator = ""
            person = isDestination ? SourcePerson : DestinationPerson
            break
        case 3:
            status = "Deleted Request to"
            color = COLOR.DARK
            indicator = ""
            person = SourcePerson
            break
        default:
            status = "Successful"
            color = "black"
            break
    }

    return (
        <TouchableOpacity key={`RM_${index}`} onPress={openRMDetails} style={[styles.card]}>
        <View style={styles.cardContent}>
             <View style={{flex: 1,height:"100%",justifyContent:"flex-start"}}>
                 <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>{status}</Text>
                 <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{person}</Text>
            </View>
            <View>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: color}}>{indicator}{tokwaAccount.wallet.currency.code} {numberFormat(+item.amount)}</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>{moment(item.updatedAt).format("MMM D, YYYY hh:mm a")}</Text>
            </View>
        </View>
          
    </TouchableOpacity>
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