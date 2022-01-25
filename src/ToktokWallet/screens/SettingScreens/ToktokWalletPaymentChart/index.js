import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,ScrollView} from 'react-native'
import {HeaderBack, HeaderTitle,YellowButton } from 'src/revamp';
import {Separator,CheckIdleState} from 'toktokwallet/components'
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
        <CheckIdleState>
            <Separator/>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <CustomTable
                    headerData={["Partner","Method","Transaction Range","Transaction Fee"]}
                    rowsData={[
                        {
                            firstCol: ["Partner"],
                            secondCol: ["Method"],
                            thirdCol: ["Transaction","Fee"],
                        },
                        {
                            firstCol: ["DRAGONPAY"],
                            secondCol: ["Online Bank"],
                            thirdCol: ["25"],
                        },
                        {
                            firstCol: ["DRAGONPAY"],
                            secondCol: ["Over the", "counter Bank"],
                            thirdCol: ["30"],
                        },
                        {
                            firstCol: ["DRAGONPAY"],
                            secondCol: ["Over the", "counter Non-Bank"],
                            thirdCol: ["35"],
                        },
                    ]}
                    rowsDataOld={
                        [
                            {
                                firstCol: ["Partner"],
                                secondCol: ["Method"],
                                thirdCol: ["Transaction","Range"],
                                fourthCol: ["Transaction","Fee"],
                            },
                            {
                                firstCol: ["UNIONBANK"],
                                secondCol: ["Over the Counter","Online Bank"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol:  ["BDO"],
                                secondCol: ["Over the Counter","Online Bank"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["CHINABANK"],
                                secondCol: ["Online Bank","ATM"],
                                thirdCol: ["--","--"],
                                fourthCol: ["25","25"],
                            },
                            {
                                firstCol: ["RCBC"],
                                secondCol: ["Over the Counter","Online Bank"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["PNB"],
                                secondCol: ["Over the Counter","Online Bank"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["UCPB"],
                                secondCol: ["Over the Counter","Online Bank"],
                                thirdCol: ["--","--"],
                                fourthCol: ["30","25"],
                            },
                            {
                                firstCol: ["METROBANK"],
                                secondCol: ["Online Bank"],
                                thirdCol: ["--"],
                                fourthCol: ["25"],
                            },
                            {
                                firstCol: ["PBCOM"],
                                secondCol: ["Online Bank"],
                                thirdCol: ["--"],
                                fourthCol: ["25"],
                            },
                            {
                                firstCol: ["ROBINSONS"],
                                secondCol:["Over the Counter"],
                                thirdCol: ["--"],
                                fourthCol: ["30"],
                            },
                            {
                                firstCol:  ["M LHUILLER","","","","","",""],
                                secondCol: ["Over the Counter","","","","","",""],
                                thirdCol: ["PHP .01 - 2,500","PHP 2,500 - 5,000","PHP 5,000.01 - 10K","PHP 10,000.01 - 20k","PHP 20,000.01 - 30K","PHP 30,000.01 - 40k","PHP 40,000.01 - 50k"],
                                fourthCol: ["35","35","35","35","40","50","60"],
                            },
                            {
                                firstCol: ["LBC"],
                                secondCol: ["Over the Counter"],
                                thirdCol: ["PHP .01 - 25k"],
                                fourthCol: ["35"],
                            },
                            {
                                firstCol: ["ECPAY"],
                                secondCol: ["Over the Counter"],
                                thirdCol: ["--"],
                                fourthCol: ["35"],
                            },
                            {
                                firstCol: ["ALIPAY"],
                                secondCol: ["E-Wallets / Mobile Payments"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol: ["WECHAT"],
                                secondCol: ["E-Wallets / Mobile Payments"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol: ["GCASH"],
                                secondCol: ["E-Wallets / Mobile Payments"],
                                thirdCol: ["--"],
                                fourthCol: ["2% + 25"],
                            },
                            {
                                firstCol:  ["IPAY88"],
                                secondCol:["Credit/Debit Card"],
                                thirdCol: ["--"],
                                fourthCol: ["4.4% + 35"],
                            },
                        ]
                    }
                />
                <View style={{height: 50}}/>
            </ScrollView>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        paddingHorizontal: 5,
    }
})