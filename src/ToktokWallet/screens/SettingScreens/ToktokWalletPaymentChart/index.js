import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,ScrollView} from 'react-native'
import {HeaderBack, HeaderTitle,YellowButton } from 'src/revamp';
import {Separator} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    CustomTable,
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width , height } = Dimensions.get("window")

export const ToktokWalletPaymentChart = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Payment Chart', '']} />,
    });

    return (
        <>
            <Separator/>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <CustomTable
                    headerData={["Method","Partner","Transaction Range","Transaction Fee"]}
                    rowsData={
                        [
                            {
                                firstCol: ["Over the Counter","Online Bank"],
                                secondCol: ["UNIONBANK"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["Over the Counter","Online Bank"],
                                secondCol: ["BDO"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["Online Bank","ATM"],
                                secondCol: ["CHINABANK"],
                                thirdCol: ["--","--"],
                                fourthCol: ["25","25"],
                            },
                            {
                                firstCol: ["Over the Counter","Online Bank"],
                                secondCol: ["RCBC"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["Over the Counter","Online Bank"],
                                secondCol: ["PNB"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["Over the Counter","Online Bank"],
                                secondCol: ["UCPB"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["Online Bank"],
                                secondCol: ["METROBANK"],
                                thirdCol: ["--"],
                                fourthCol: ["25"],
                            },
                            {
                                firstCol: ["Online Bank"],
                                secondCol: ["PBCOM"],
                                thirdCol: ["--"],
                                fourthCol: ["25"],
                            },
                            {
                                firstCol: ["Over the Counter"],
                                secondCol: ["ROBINSONS"],
                                thirdCol: ["--"],
                                fourthCol: ["30"],
                            },
                            {
                                firstCol: ["Over the Counter","","","","","",""],
                                secondCol: ["M LHUILLER","","","","","",""],
                                thirdCol: ["PHP .01 - 2,500","PHP 2,500 - 5,000","PHP 5,000.01 - 10K","PHP 10,000.01 - 20k","PHP 20,000.01 - 30K","PHP 30,000.01 - 40k","PHP 40,000.01 - 50k"],
                                fourthCol: ["35","35","35","35","40","50","60"],
                            },
                            {
                                firstCol: ["Over the Counter"],
                                secondCol: ["LBC"],
                                thirdCol: ["PHP .01 - 25k"],
                                fourthCol: ["35"],
                            },
                            {
                                firstCol: ["Over the Counter"],
                                secondCol: ["ECPAY"],
                                thirdCol: ["--"],
                                fourthCol: ["35"],
                            },
                            {
                                firstCol: ["E-Wallets / Mobile Payments"],
                                secondCol: ["ALIPAY"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol: ["E-Wallets / Mobile Payments"],
                                secondCol: ["WECHAT"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol: ["E-Wallets / Mobile Payments"],
                                secondCol: ["GCASH"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol: ["Credit/Debit Card"],
                                secondCol: ["IPAY88"],
                                thirdCol: ["--"],
                                fourthCol: ["4.4% + 35"],
                            },
                        ]
                    }
                />
                <View style={{height: 50}}/>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        paddingHorizontal: 5,
    }
})