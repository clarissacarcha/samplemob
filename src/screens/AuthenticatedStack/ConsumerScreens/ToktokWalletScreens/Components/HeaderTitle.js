import React from 'react'
import {View,Text,StyleSheet,Image,Platform} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../../../../res/constants'
import { HeaderBack } from '../../../../../revamp'

export const HeaderTitle = ({isLogo, label ,labelColor = COLORS.DARK , backButtonColor = COLORS.DARK})=> {

    return (
        <View style={styles.header}>
                <View style={{flex: 1}}>
                    <HeaderBack color={backButtonColor}/>
                </View>
                <View style={{width: 150,justifyContent:"center",alignItems:"center"}}>
                {
                    isLogo
                    ? <Image resizeMode="contain" style={{height: 23,width: 130}} source={require('../../../../../assets/toktokwallet-assets/toktokwallet.png')} />
                    : <Text style={{fontSize: SIZES.L,fontFamily: FONTS.BOLD,color: labelColor}}>{label}</Text>
                }
                </View>
                <View style={{flex: 1}}>

                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        // marginTop: 42,
        marginTop: Platform.OS === "ios" ? 22 : 42,
        height: 24,
        width: "100%",
        flexDirection:"row"
    },
})