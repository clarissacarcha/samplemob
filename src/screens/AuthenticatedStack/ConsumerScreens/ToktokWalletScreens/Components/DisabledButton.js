import React from 'react'
import {View,Text} from 'react-native'
import {FONTS, SIZES ,COLORS} from '../../../../../res/constants'


export const DisabledButton = ({label})=> {
    return (
        <View style={{justifyContent:"center",alignItems:"center",height: 50,backgroundColor: "#F7F7FA",borderRadius: 5}}>
            <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.L,color:"gray"}}>{label}</Text>
        </View>
    )
}
