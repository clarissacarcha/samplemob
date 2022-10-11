import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useThrottle } from "src/hooks";
import { useNavigation } from "@react-navigation/native";
import { ICON_SET, VectorIcon  } from 'src/revamp'
import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

export const TransactionHistory = ()=> {
    const navigation = useNavigation();
    const onPress = useThrottle(()=> navigation.navigate("ToktokWalletTransactions"))
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.label}>View Transaction History </Text>
            <VectorIcon size={16} color={COLOR.ORANGE} iconSet={ICON_SET.Feather} name="chevron-right"/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"flex-end",
    },
    label: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color: COLOR.ORANGE
    }
})