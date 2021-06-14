import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,ScrollView} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {HeaderBack, HeaderTitle,YellowButton } from '../../../../../../../revamp';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';
import {Separator} from '../../../Components'
import { COLORS } from '../../../../../../../res/constants';

//SELF IMPORTS
import CustomTable from './customtable'
import { TouchableOpacity } from 'react-native-gesture-handler';

const PaymentChartScreen = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Payment Chart', '']} />,
    });

    return (
        <>
        <View style={styles.container}>
            <Separator />             
            <CustomTable
                heading={[
                    {size: 220, value: "Method"},
                    {size: 150, value: "Processor (Proc)"},
                    {size: 180, value: "Payment Deadline"},
                    {size: 150, value: "Charge to Client (Php)"},
                    {size: 350, value: "Partner's charge to CloudPanda (Php)"},
                    {size: 180, value: "Charge to Merchant (Php)"}
                ]}
                rows={[
                    {
                        '0': ["Over-the-Counter", "Online Bank"],
                        '1': ["UNIONBANK"],                        
                        '2': ["2 days", "1 hour"],
                        '3': ["--", "--"],
                        '4': ["10", "30"],
                        '5': ["10", "25"]               
                    },
                    {
                        '0': ["Over-the-Counter", "Online Bank"],
                        '1': ["BDO"],                        
                        '2': ["2 days", "2 days"],
                        '3': ["--", "--"],
                        '4': ["15", "30"],
                        '5': ["5", "25"]               
                    },
                    {
                        '0': ["Online Bank", "ATM"],
                        '1': ["CHINABANK"],                        
                        '2': ["1 hour", "2 days"],
                        '3': ["--", "--"],
                        '4': ["10", "25"],
                        '5': ["10", "25"]               
                    },
                    {
                        '0': ["Over-the-Counter"],
                        '1': ["LBC"],                        
                        '2': ["2 days"],
                        '3': ["--"],
                        '4': ["20"],
                        '5': ["35"]               
                    },
                    {
                        '0': ["Over-the-Counter"],
                        '1': ["ECPAY"],                        
                        '2': ["2 days"],
                        '3': ["--"],
                        '4': ["20"],
                        '5': ["35"]               
                    },
                    {
                        '0': ["E-Wallets / Mobile Payments"],
                        '1': ["ALIPAY"],                        
                        '2': ["2 minutes"],
                        '3': ["--"],
                        '4': ["2%"],
                        '5': ["2% + 25"]               
                    },
                    {
                        '0': ["E-Wallets / Mobile Payments"],
                        '1': ["WECHAT"],                        
                        '2': ["2 minutes"],
                        '3': ["--"],
                        '4': ["2%"],
                        '5': ["2% + 25"]               
                    },
                    {
                        '0': ["E-Wallets / Mobile Payments"],
                        '1': ["GCASH"],                        
                        '2': ["   "],
                        '3': ["   "],
                        '4': ["2%"],
                        '5': ["2% + 25"]               
                    },
                    {
                        '0': ["Online Bank", "Over-the-Counter"],
                        '1': ["RCBC"],                        
                        '2': ["1 hour", "2 days"],
                        '3': ["--", "--"],
                        '4': ["5", "25"],
                        '5': ["20", "30"]               
                    },
                    {
                        '0': ["Online Bank", "Over-the-Counter"],
                        '1': ["PNB"],                        
                        '2': ["  ", "  "],
                        '3': ["  ", "  "],
                        '4': ["10", "25"],
                        '5': ["15", "30"]               
                    },
                    {
                        '0': ["Online Bank", "Over-the-Counter"],
                        '1': ["UCPB"],                        
                        '2': ["2 days", "   "],
                        '3': ["--", "  "],
                        '4': ["10", "25"],
                        '5': ["10", "30"]               
                    },                    
                    {
                        '0': ["Online Bank"],
                        '1': ["METROBANK"],                        
                        '2': ["   "],
                        '3': ["   "],
                        '4': ["10"],
                        '5': ["25"]               
                    },
                    {
                        '0': ["Online Bank", "Over-the-Counter\n\n\n\n\n\n"],
                        '1': ["PBCOM"],                        
                        '2': ["  ", "\n\n\n\n\n\n\n"],
                        '3': ["  ", "\n\n\n\n\n\n\n"],
                        '4': ["15", 
                            "PHP 1-5000 > 30", 
                            "PHP 5001-7500 > 25", 
                            "PHP 75001-10,000 > 20", 
                            "more than 10,000 per transaction > 15.00"
                        ],
                        '5': ["25", "\n\n\n\n\n\n\n"]
                    },
                    {
                        '0': ["Over-the-Bank Counter"],
                        '1': ["ROBINSONS BANK"],                        
                        '2': ["   "],
                        '3': ["   "],
                        '4': ["15"],
                        '5': ["30"]               
                    },
                    {
                        '0': ["Over-the-Counter"],
                        '1': ["M LHUILLER"],                        
                        '2': ["2 days"],
                        '3': ["--", "--", "  ", "  ", "  ", "  ", "  "],
                        '4': [
                            "PHP .01 - 2,500 > 10", 
                            "PHP 2,500 - 5,000 > 15", 
                            "PHP 5,000.01 - 10k > 20", 
                            "PHP 10,000.01 - 20k > 25", 
                            "PHP 20,000.01 - 30k > 30", 
                            "PHP 30,000.01 - 40k > 40", 
                            "PHP 40,000.01 - 50k > 50"
                        ],
                        '5': ["35", "35", "35", "35", "40", "50", "60"]
                    },
                    {
                        '0': ["Online Bank", "Over-the-Counter Bank", "Over-the-Counter Non-Bank"],
                        '1': ["DRAGONPAY"],                        
                        '2': ["   ", "  ", "  "],
                        '3': ["   ", "  ", "  "],
                        '4': ["10", "15", "20"],
                        '5': ["25", "30", "35"]
                    },
                ]} 
            />

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
    cellhead: {
        flex: 1, 
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: COLORS.ORANGE, 
        borderTopWidth: 0.4,
        borderLeftColor: COLORS.ORANGE, 
        borderLeftWidth: 0.4, 
        backgroundColor: COLORS.TRANSPARENT_YELLOW,
        padding: 8
    }, 
    cell: {
        flex: 1, 
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: COLORS.ORANGE, 
        borderTopWidth: 0.25,
        borderLeftColor: COLORS.ORANGE, 
        borderLeftWidth: 0.25, 
        padding: 8
    }
})
