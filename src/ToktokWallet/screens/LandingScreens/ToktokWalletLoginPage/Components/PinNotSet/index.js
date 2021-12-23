import React from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import { BuildingBottom } from 'toktokwallet/components'
import { YellowButton } from 'src/revamp'
import { useNavigation } from '@react-navigation/native'
import { moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT, FONT_SIZE } = CONSTANTS

export const PinNotSet = ()=> {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
                <View style={styles.content}>
                <Image source={require("toktokwallet/assets/images/error.png")}/>
                <Text style={styles.title}>Sorry your toktokwallet can't be used in this device.</Text>
                <Text style={styles.message}>
                        Either the Password/PIN/Pattern lock screen has not been set in your phone's settings or this device does not support the specified lock screen options.
                </Text>
                </View>
                <View style={{height: 50}}>
                    <YellowButton label="Back" onPress={()=>navigation.pop()}/>
                </View>
                <BuildingBottom/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    content: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
    title: {
        fontFamily: FONT.BOLD,
        // color: COLOR.RED,
        fontSize: moderateScale(FONT_SIZE.L),
        marginVertical: 15,
        textAlign:"center",
        marginHorizontal: 20
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: moderateScale(FONT_SIZE.M)
    }
})