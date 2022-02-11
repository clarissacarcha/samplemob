import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { Separator } from 'toktokwallet/components'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import {useSelector} from 'react-redux'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT, SHADOW  } = CONSTANTS
export const FinishRequirement = ({ finishLabel })=> {
    return (
        <View style={[ styles.cardShadow, styles.cardStyle, { flexDirection: "row", alignItems: "center" } ]}>
            <Image source={require('toktokwallet/assets/images/success.png')} style={{ width: 45, height: 45 }}/>
            <Text style={[ styles.fontRegularStyle, { flexShrink: 1, marginLeft: 15 } ]}>
                { finishLabel }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    fontRegularStyle: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },
    cardShadow: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
    
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardStyle: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginBottom: 20,
        alignItems: "center",
    }
})