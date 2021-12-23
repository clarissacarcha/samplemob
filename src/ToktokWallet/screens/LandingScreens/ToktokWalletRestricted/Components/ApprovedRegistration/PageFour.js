import React from 'react'
import { View , Text , StyleSheet , Animated , Dimensions , Image } from 'react-native'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import NumberStep from "./NumberStep";

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width , height } = Dimensions.get("window")

const PageFour = ({scale,tokwaAccount})=> {

    return (
        <>
        <Animated.View style={{...styles.container,transform: [{scale: scale}]}}>
                <Text style={styles.headerText}>
                You can now start enjoying your e-wallet through 5 easy steps:
                </Text>

                <View style={{marginTop: 20, alignItems:"center"}}>
                    <NumberStep label="Proceed to transaction" number="4"/>
                    <Image resizeMode="contain" style={styles.proceedImage} source={require("toktokwallet/assets/images/welcome/proceed.png")}/>
                    <NumberStep label="Enter your 6-digit TPIN" number="5"/>
                    <View style={{height: 20}}/>
                    <Image resizeMode="contain" style={styles.tpinImage} source={require("toktokwallet/assets/images/welcome/tpin.png")}/>
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
    proceedImage: {
        height: height * 0.15,
        width: width * 0.6,
        marginTop: 5,
        marginBottom: 5,
    },
    tpinImage: {
        height: height * 0.15,
        width: width * 0.8,
        marginTop: 5,
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        // textAlign:"justify",
        marginHorizontal: 10,
    }
})

export default PageFour

