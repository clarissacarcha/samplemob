import React from 'react'
import {View , Text , TouchableOpacity , StyleSheet } from 'react-native'
import { Separator } from 'toktokwallet/components'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const SampleHitSlopTouchableOpacity = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Request Money']} />,
    })

    return (
        <> 
        <Separator/>
        <View style={styles.container}>
            <View style={{height: 200, backgroundColor:"green",justifyContent:'center',alignItems:"center"}}>
                <TouchableOpacity hitSlop={{top: 20 , bottom: 20 , left: 20, right: 20}} style={{height: 50 , width: 100,backgroundColor:"blue"}} onPress={()=>console.log("GG")}>
                <Text>CLICK ME</Text>
                </TouchableOpacity>

            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: MARGIN.M,
        backgroundColor:"white"
    }
})