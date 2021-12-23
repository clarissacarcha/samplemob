import React from 'react'
import {Image,ImageBackground ,StyleSheet,View} from 'react-native'

export const HeadingBannerLogo = ()=> {

    return (
        <ImageBackground imageStyle={[]} style={styles.walletbackgroundimage} source={require('toktokwallet/assets/images/header-bg.png')}>
                <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                        <Image resizeMode="contain" style={{height: 30,width: 200}} source={require('toktokwallet/assets/images/toktokwallet.png')} />
                </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
})

