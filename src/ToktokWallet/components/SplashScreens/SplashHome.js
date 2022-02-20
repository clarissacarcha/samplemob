import React from 'react'
import { View , StyleSheet , Image , Dimensions } from 'react-native'
import tokwaLogo from 'toktokwallet/assets/images/tokwa2.png'
import { verticalScale } from 'toktokwallet/helper'

const {width,height} = Dimensions.get("window")

export const SplashHome = ()=> (
    <View style={styles.container}>
                 <Image
                        style={styles.tokwaLogo}
                        source={tokwaLogo}
                        resizeMode="contain"
                 />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#FFF6E1"
    },
    tokwaLogo: {
        height: verticalScale(80),
        width: width * 0.7,
        marginTop: 20,
    },
})