import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {YellowButton } from '../../../../../../../revamp';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';


const PaymentChartScreen = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Payment Chart', '']} />,
    });

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
                    <Text style={{fontFamily: FONT.REGULAR , fontSize: FONT_SIZE.M}}>
                        Please wait for the approval of your verification.
                    </Text>
                </View>
             </View>
            
            
        </View>
        </>
    )
}

export default PaymentChartScreen

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
