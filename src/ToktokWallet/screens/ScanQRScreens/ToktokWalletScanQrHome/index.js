import React from 'react';
import { View , Text , StyleSheet, ScrollView } from 'react-native';
import { HeaderBack , HeaderTitle , ICON_SET, VectorIcon } from 'src/revamp';
import { CheckIdleState, FlagSecureScreen , BuildingBottom , Separator } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
    Header,
    MyQrCode,
    ScanQrOption
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS;

export const ToktokWalletScanQrHome = ({
    navigation,
    route
})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Pay QR']} />,
    })

    const scanOptions = [
        {logo: require('toktokwallet/assets/images/send-money.png'), label: "Send Money" , route: "ToktokWalletScanQR"},
        {logo: require('toktokwallet/assets/images/qrPayment.png'), label: "QR Payment", route: "ToktokWalletMerchantPayment"}
    ]

    return (
        <FlagSecureScreen>
            <CheckIdleState>
                <Separator/>    
                <View style={styles.container}>
                    <Header/>
                    <ScrollView>
                    <MyQrCode/>
                    <View style={{justifyContent:'center',alignItems:'center',paddingVertical:16}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Choose Scan QR Transaction</Text>
                    </View>
                    <View style={styles.options}>
                        {
                            scanOptions.map((item,index)=> (<ScanQrOption logo={item.logo} label={item.label} route={item.route}/>))
                        }
                    </View>
                    </ScrollView>
                    <BuildingBottom/>
                </View>
            </CheckIdleState>
        </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        // padding: 16
    },
    options: {
        paddingHorizontal: 16,
    }
})