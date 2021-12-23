import React from 'react'
import { View , Text , StyleSheet , Animated , Dimensions , Image } from 'react-native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width , height } = Dimensions.get("window")

const PageOne = ({scale,tokwaAccount})=> {

    return (
        <>
        <Animated.View style={{...styles.container,transform: [{scale: scale}]}}>
                <Text style={styles.headerText}>
                    Welcome to toktokwallet!
                </Text>
                <Image resizeMode="contain" style={styles.welcomeImage} source={require("toktokwallet/assets/images/welcome/welcome.jpg")}/>
                <Text style={styles.message}>
                    Welcome Ka-toktok, {tokwaAccount.person.firstName}! Thank you for
                    choosing toktokwallet, your daily partner
                    on all cashless transactions such as fund
                    transfers to any participating bank and
                    non-bank partners, pay your bills online
                    and buy e-load anytime anywhere.
                </Text>
        </Animated.View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"transparent",
        width: width,
        alignItems:"center"
    },
    headerText: {
        marginTop: 10,
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.XL,
        color: COLOR.YELLOW,
        textAlign:"center"
    },
    welcomeImage: {
        height: height / 2,
        width: width * 0.8,
        marginVertical: 10,
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"center",
        marginHorizontal: 10,
        color: COLOR.YELLOW,
    }
})

export default PageOne
