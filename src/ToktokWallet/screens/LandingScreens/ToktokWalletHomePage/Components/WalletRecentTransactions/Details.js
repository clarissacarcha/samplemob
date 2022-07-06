import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions, Image} from 'react-native';
import { TransactionModal } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants'
import { moderateScale } from "toktokwallet/helper";
import infoIcon from 'toktokwallet/assets/icons/infoIcon.png';

const { COLOR, FONT_FAMILY: FONTS, FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")


const renderDetails = ({details})=> {
    if(details){
        const data = Object.entries(details)
        const RenderInfo = data.map((data,index)=> {
            console.log("data", data)
            if(!data[0] && !data[1]) return null
            const key = data[0]
            const value = data[1]
            // console.log(key,value)
            return (
                <Text key={`externalDetails_${index}`} style={styles.labelText}>{key}: <Text>{value}</Text></Text>
            )
        })
        return RenderInfo
    }

    return null
  
}

const Details = ({
    transaction,
    visible,
    setVisible
})=> {

    const {
        name,
        phrase,
        displayInfo,
    } = transaction

    const dataSample = { 
        Status: "Success",
        Amount: "2,000.00",
        ServiceFee: "10.00",
        RecipientName: "Juan Dela Cruz",
        RecipientMobileNumber: "09123456789",
        EmailAddress: "juandelacruz@toktok.ph",
        Purpose: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non vestibulum enim, ac fringilla ante. Donec consectetur tempus tortor, vel vulputate odio pharetra volutpat.",
        ServiceReferenceNumber: "1234567890",
        TransactionDate: "Jan, 7 2021, 10:30 PM"
    };

    return (
        <TransactionModal
            visible={visible}
            setVisible={setVisible}
        >
            <View>
                 <Text style={styles.cashOutText}>Cash Out</Text>
                 <Text style={styles.labelCashOut}>Cash Out through LBC Express</Text>
                 {/* here pending code */}
                 <View style={{marginTop: 15}}>
                    {renderDetails({details: dataSample})}
                </View>
            </View>
        </TransactionModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.1)",
        justifyContent:"center",
        alignItems:"center"
    },
    labelText: {
        paddingVertical: moderateScale(4),
        fontFamily: FONTS.BOLD,
        fontSize: FONT_SIZE.M,
    },
    labelCashOut: {
        fontFamily: FONTS.REGULAR,
        fontSize: FONT_SIZE.M,
    },
    cashOutText:{
        fontFamily: FONTS.BOLD, 
        fontSize: moderateScale(18),
    },
    pendingContent: {
        marginTop: moderateScale(15),
        flexDirection: 'row',
        backgroundColor: COLOR.LIGHT_YELLOW,
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(16),
    },
    pendingPolicty: {
        height:13,
        width: 13,
        marginRight: 10,
    },
    pendingText: {
        color: '#F6841F',
        fontSize: FONT_SIZE.S,
    },
})

export default Details
