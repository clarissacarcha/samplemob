import React from 'react'
import {View,Text} from 'react-native'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

export const DisabledButton = ({label})=> {
    return (
        <View style={{justifyContent:"center",alignItems:"center",height: 50,backgroundColor: "#F7F7FA",borderRadius: 5}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,color:"gray"}}>{label}</Text>
        </View>
    )
}
