import React, { useState , useEffect , useCallback } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator , BuildingBottom } from 'toktokwallet/components'
import { getStatusbarHeight , scale , moderateScale } from 'toktokwallet/helper' 
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

export const HaveInactiveAccount = ()=> {

    const navigation = useNavigation()

    const HelpCenter = ()=> navigation.push("ToktokWalletHelpCentreContactUs")

    return (
        <>
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Your account is inactive</Text>
                <Text style={styles.message}>You currently have an existing inactive account.
                    Please contact our Customer Service Representative
                    for support.
                </Text>
                <TouchableOpacity onPress={HelpCenter} style={styles.helpCenter}>
                    <Text style={styles.labelHC}>Help Center</Text>
                 </TouchableOpacity>
            </View>

            <View style={{height: 70,justifyContent:'flex-end'}}>
                <YellowButton label="Back" onPress={()=> {
                    navigation.pop()
                }}/>
            </View>
            <BuildingBottom/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white",
        marginTop: getStatusbarHeight,
    },
    content: {
        flex: 1,
        alignItems:"center",
        paddingTop: 100,
    },
    title: {
        fontSize: scale(FONT_SIZE.XL),
        fontFamily: FONT.BOLD,
        marginVertical: 15,
    },
    message: {
        fontSize: scale(FONT_SIZE.M),
        fontFamily: FONT.REGULAR,
        paddingHorizontal: scale(10),
        textAlign: 'center',
        marginBottom: 15,
    },
    helpCenter: {
        justifyContent:'center',
        alignItems:'center',
    },
    labelHC: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.L,
        color: COLOR.ORANGE,
        textDecorationLine:"underline"
    }
})