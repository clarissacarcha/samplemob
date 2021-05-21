import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {YellowButton } from '../../../../../../../revamp';
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../../../res/constants';



const VerifyPendingScreen = ({navigation})=> {

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
             
             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {/* <View style={styles.checkIcon}>
                    <FIcon5 name="check" color="white" size={60}/> 
                </View> */}
                <Image style={{marginBottom: 10}} source={require('../../../../../../../assets/toktokwallet-assets/success.png')}/>
                <View>
                    <Text style={styles.titleText}>Success!</Text>
                </View>
                <View style={{padding: 8}}>
                    <Text style={{color: "gray",fontFamily: FONTS.REGULAR , fontSize: SIZES.M}}>
                        Please wait for the approval of your verification.
                    </Text>
                </View>
             </View>
            
            <View style={styles.actionBtn}>
                <YellowButton label="Done" onPress={() => {
                    // navigation.pop()
                    // navigation.navigate("ToktokWalletHomePage")
                    navigation.replace("ToktokWalletHomePage")
                }} />
            </View>
        </View>
        </>
    )
}

export default VerifyPendingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    checkIcon: {
        height: 98,
        width: 98,
        backgroundColor: COLORS.YELLOW,
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },  
    titleText: {
        marginTop: 17,
        fontSize: SIZES.XL,
        fontFamily: FONTS.BOLD,
        color: COLORS.DARK,
    },
    actionBtn: {
        height: 70,
        padding: 16,
        justifyContent:"flex-end",
        marginBottom: Platform.OS == "ios" ? 25 : 0
    }
})
