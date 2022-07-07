import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions, Image} from 'react-native';
import { TransactionModal } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants'
import { moderateScale } from "toktokwallet/helper";
import infoIcon from 'toktokwallet/assets/icons/info-icon.png';

const { COLOR, FONT_FAMILY: FONTS, FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")


const renderDetails = ({details})=> {
    if(details){
        const data = Object.entries(details)
        const RenderInfo = data.map((data,index)=> {
            if(!data[0] && !data[1]) return null
            const key = data[0]
            const value = data[1]
            return (
                <Text style={{ paddingVertical: moderateScale(4)}}>
                     <Text key={`externalDetails_${index}`} style={styles.labelText}>{key}: </Text>
                     <Text key={`externalDetails_${index}`}>{value}</Text>
                </Text>    
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

    return (
        <TransactionModal
            visible={visible}
            setVisible={setVisible}
        >
            <View>
                 <Text style={styles.cashOutText}>Cash Out</Text>
                 <Text style={styles.labelCashOut}>Cash Out through LBC Express</Text>
                 {/* {status != "Success" && (
                    <View style={styles.pendingContent}>
                        <Image
                            source={infoIcon}
                            style={styles.pendingPolicty}
                        />
                        <View>
                            <Text style={styles.pendingText}>All transactions made before 01.00 PM will be processed within the day.</Text>
                            <Text style={styles.pendingText}>All transactions after 01.00 PM will be processed the next banking day.</Text>
                        </View>
                 </View>)} */}
                 <View style={{marginTop: 15}}>
                    {renderDetails({details: displayInfo})}
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
