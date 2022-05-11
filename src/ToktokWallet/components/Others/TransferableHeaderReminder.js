import React from 'react';
import { View , Text , StyleSheet ,TouchableOpacity } from 'react-native';
import { VectorIcon , ICON_SET } from 'src/revamp';
import { useNavigation } from '@react-navigation/native';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
export const TransferableHeaderReminder = ()=> {

    const navigation = useNavigation();
    const openReminder = ()=> navigation.navigate("ToktokWalletBalanceInfo")

    return (
        <TouchableOpacity onPress={openReminder} style={styles.headerReminder}>
            <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}>
                <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                <Text style={{fontFamily:FONT.BOLD,fontSize: FONT_SIZE.M,marginLeft: 3}}>Transferable and Non-transferable amount?</Text> 
            </View>
            <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M}}>
                Click here to read more about transferable and non-transferable amount.
            </Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    headerReminder: {
        padding: 16,
        backgroundColor:"#FFF2D5"
    },
})