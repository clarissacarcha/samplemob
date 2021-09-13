import React from 'react'
import { View , Text , StyleSheet , Animated , Dimensions } from 'react-native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width} = Dimensions.get("window")

const PageTwo = ({scale})=> {

    return (
        <>
        <Animated.View style={{...styles.container,transform: [{scale: scale}]}}>
                <Text style={styles.headerText}>
                    You can now start enjoying your e-wallet through 5 easy steps:
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
        width: width
    },
    headerText: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.XL,
        textAlign:"center"
    }
})

export default PageTwo