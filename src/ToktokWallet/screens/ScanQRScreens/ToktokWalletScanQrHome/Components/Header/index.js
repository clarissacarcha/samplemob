import React from 'react';
import { View , Text , StyleSheet ,TouchableOpacity } from 'react-native';
import { VectorIcon , ICON_SET } from 'src/revamp';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
export const Header = ()=> {

    return (
        <View style={styles.headerReminder}>
            <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}>
                <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                <Text style={{fontFamily:FONT.BOLD,fontSize: FONT_SIZE.M,marginLeft: 3}}>New to Scan QR Transactions?</Text> 
            </View>
            <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M}}>
            Make your payment experience extremely quick and easy with your favorite Merchant QR Partners and/or send money to your loved ones using toktokwallet scan QR transactions. Just simply scan QR, enter the amount then confirm your payment.
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    headerReminder: {
        padding: 16,
        backgroundColor:"#FFF2D5",
        marginBottom: 16,
    },
})