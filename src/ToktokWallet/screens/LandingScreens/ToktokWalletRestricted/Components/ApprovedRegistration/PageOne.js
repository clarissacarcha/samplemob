import React from 'react'
import { View , Text , StyleSheet , Animated , Dimensions } from 'react-native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width} = Dimensions.get("window")

const PageOne = ({scale})=> {

    return (
        <>
         <Animated.View style={{flex: 1,justifyContent:"center",alignItems:"center",width: width , transform: [{scale: scale}]}}>
                <Text style={{fontSize: 25}}>Template 1</Text>
        </Animated.View>
        </>
    )
}

export default PageOne