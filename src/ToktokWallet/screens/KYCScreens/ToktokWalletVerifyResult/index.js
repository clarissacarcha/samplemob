import React from 'react'
import {View,Text,StyleSheet,Platform,StatusBar,Image} from 'react-native'
import {YellowButton } from 'src/revamp';
import CONSTANTS from 'common/res/constants';

const { COLOR, FONT_FAMILY: FONT, FONT_SIZE } = CONSTANTS

export const ToktokWalletVerifyResult = ({navigation})=> {

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
             
             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{marginBottom: 10}} source={require('toktokwallet/assets/images/success.png')}/>
                <View>
                    <Text style={styles.titleText}>Success!</Text>
                </View>
                <View style={{padding: 8}}>
                    <Text style={{fontFamily: FONT.REGULAR , fontSize: FONT_SIZE.M}}>
                        Please wait for the approval of your verification.
                    </Text>
                </View>
             </View>
            
            <View style={styles.actionBtn}>
                <YellowButton label="Done" onPress={() => {
                    navigation.replace("ToktokWalletHomePage")
                }} />
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    checkIcon: {
        height: 98,
        width: 98,
        backgroundColor: COLOR.YELLOW,
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },  
    titleText: {
        marginTop: 17,
        fontSize: FONT_SIZE.XL,
        fontFamily: FONT.BOLD,
    },
    actionBtn: {
        height: 70,
        padding: 16,
        justifyContent:"flex-end",
        marginBottom: Platform.OS == "ios" ? 25 : 0
    }
})
