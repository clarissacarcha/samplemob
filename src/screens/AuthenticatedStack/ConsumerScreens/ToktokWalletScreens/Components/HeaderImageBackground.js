import React from 'react'
import {ImageBackground,StyleSheet} from 'react-native'

export const HeaderImageBackground = ({children})=> {

    return (
        <ImageBackground imageStyle={[]} style={styles.walletbackgroundimage} source={require('../../../../../assets/toktokwallet-assets/header-bg.png')}>
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

