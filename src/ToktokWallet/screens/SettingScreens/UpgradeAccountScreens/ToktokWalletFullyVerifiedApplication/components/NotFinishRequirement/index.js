import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Separator } from 'toktokwallet/components'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import {useSelector} from 'react-redux'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT, SHADOW  } = CONSTANTS

export const NotFinishRequirement = ({ notFinishLabel, btnLabel, onPress, disabled })=> {

    return (
        <View style={[ styles.cardShadow, styles.cardStyle ]}>
            <Text style={[ styles.fontRegularStyle, { textAlign: "center" } ]}>
                { notFinishLabel }
            </Text>
            <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
                <Text style={[ styles.fontBoldStyle, { textAlign: "center" } ]}>
                    { btnLabel }
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    fontRegularStyle: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },
    fontBoldStyle: {
        fontFamily: FONT.BOLD,
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
        padding: 20,
        marginBottom: 20,
        alignItems: "center",
    },
    buttonStyle: {
        backgroundColor: COLOR.YELLOW,
        borderRadius: 5,
        width: "40%",
        paddingVertical: 7,
        marginTop: 20
    }
})