import React from 'react'
import {View , Text , TouchableOpacity , StyleSheet } from 'react-native'
import {HeaderImageBackground,HeaderTitle,CheckIdleState,Separator} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const ToktokWalletRequestMoney = ({navigation,route})=> {

    navigation.setOptions({
        headerShown:false,
    })

    return (
        <CheckIdleState> 
            <View style={styles.container}>
                <View style={styles.headings}>
                    <HeaderImageBackground>
                    <HeaderTitle label="Request Money"/>

                    </HeaderImageBackground>
                </View>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
})