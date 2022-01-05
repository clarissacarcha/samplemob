import React from 'react'
import { View , Text , StyleSheet , Animated , Dimensions , Image } from 'react-native'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import NumberStep from "./NumberStep";

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width , height } = Dimensions.get("window")

const PageThree = ({scale,tokwaAccount})=> {

    return (
        <>
        <Animated.View style={{...styles.container,transform: [{scale: scale}]}}>
                <Text style={styles.headerText}>
                You can now start enjoying your e-wallet through 5 easy steps:
                </Text>

                <View style={{marginTop: 20, alignItems:"center"}}>
                    <NumberStep label="Enter your desired amount" number="3"/>
                    <Image resizeMode="contain" style={styles.cashInImage} source={require("toktokwallet/assets/images/welcome/paypandaAmount.png")}/>
                </View>
                
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
        textAlign:"center"
    },
    cashInImage: {
        height: height / 2,
        width: width * 0.6,
        marginTop: -10,
    },

    message: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        // textAlign:"justify",
        marginHorizontal: 10,
    }
})

export default PageThree
