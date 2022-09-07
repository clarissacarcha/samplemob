import React from 'react'
import { View , Text , StyleSheet, TouchableOpacity } from 'react-native'
import { useThrottle } from 'src/hooks';
import { getStatusbarHeight , moderateScale } from 'toktokwallet/helper'
import { HeaderBack } from 'toktokwallet/components'
import {VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

export const NavigationView = ({
    canGoBack,
    canGoForward,
    goBack,
    goForward,
})=> {

    const onThrottledBackPress = useThrottle(goBack , 2000);
    const onThrottledForwardPress = useThrottle(goForward , 2000);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onThrottledBackPress} style={styles.back}>
                <VectorIcon iconSet={ICON_SET.FontAwesome5} size={moderateScale(16)} name="chevron-left" color={COLOR.YELLOW} />
            </TouchableOpacity>
            <View style={styles.cancel}>
               
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: moderateScale(40),
        backgroundColor:'rgba(255,255,255,0.5)',
        marginTop: getStatusbarHeight,
        flexDirection:"row",
    },
    back: {
        flex: 1,
        alignItems:"center",
        justifyContent:"flex-start",
        flexDirection:"row",
        marginLeft: 16,
    },
    cancel: {
        flex: 1,
    }
})