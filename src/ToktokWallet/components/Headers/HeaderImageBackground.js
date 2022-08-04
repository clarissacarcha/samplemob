import React from 'react'
import {ImageBackground,StyleSheet} from 'react-native'
import {home} from 'toktokwallet/assets';

export const HeaderImageBackground = ({children})=> {

    return (
        <ImageBackground imageStyle={[]} style={styles.walletbackgroundimage} source={require('toktokwallet/assets/images/header-bg.png')}>
                {children}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
})

