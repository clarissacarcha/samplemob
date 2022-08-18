import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import {Separator,CheckIdleState, HeaderBack, HeaderTitleRevamp ,} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { LayeredSecurityMoneyProtected } from "./Components";

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const Card = (props) => {
    return (
        <>
            <Separator />    
                <TouchableOpacity onPress={props.onPress || null} style={{flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 18}}>
                    <View style={{flex: 3, justifyContent: 'center',paddingVertical: 20,}}>
                        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.L}}>{props.title}</Text>
                        {/* <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>{props.content}</Text> */}
                    </View>
                    {/* <View style={{flex: 1.5, flexDirection: 'row-reverse'}}>
                        <Image style={{margin: 8, resizeMode: 'contain', width: 80, height: 90}} source={props.imageSource}/>
                    </View> */}
                </TouchableOpacity>
        </>
    )
} 

export const ToktokWalletHelpCentreSecurityPrivacy = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack/>,
        headerTitle: () => <HeaderTitleRevamp label={['Privacy and Policy', '']} />,
    });

    return (
        <CheckIdleState>
        <View style={styles.container}>
            <View style={{flex: 1}}>    
                <LayeredSecurityMoneyProtected/>
            </View>
        </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
