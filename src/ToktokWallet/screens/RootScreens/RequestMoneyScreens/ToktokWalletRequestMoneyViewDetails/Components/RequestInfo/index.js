import React from 'react'
import { View , Text , StyleSheet } from 'react-native'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const RequestInfo = ({label,value})=> {

    return (
       <>
         <View style={styles.container}>
            <Text style={[styles.label]}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
        <View style={{borderBottomWidth: 1.5, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        paddingVertical: 16,
    },
    label: {
        flex: 1,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },
    value: {
        flex: 1,
        justifyContent:"flex-end",
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        textAlign:"right"
    }
})