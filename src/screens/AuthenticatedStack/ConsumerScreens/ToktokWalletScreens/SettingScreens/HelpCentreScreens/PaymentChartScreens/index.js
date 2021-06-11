import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image} from 'react-native'
import {YellowButton ,HeaderBack, HeaderTitle, } from '../../../../../../../revamp';
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
