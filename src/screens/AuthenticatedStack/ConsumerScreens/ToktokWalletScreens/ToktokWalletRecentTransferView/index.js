import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import { HeaderBackClose,HeaderTitle } from '../../../../../components'
import { COLORS, FONTS, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import Separator from '../Components/Separator'
import moment from 'moment'
import { numberFormat } from '../../../../../helper'
import { YellowButton } from '../../../../../revamp'


const Details = ({label,value})=> {
    return (
        <View style={styles.details}>
            <View style={styles.label}>
                <Text style={styles.labelText}>{label}</Text>
            </View>
            <View style={styles.value}>
                <Text style={styles.valueText}>{value}</Text>
            </View>
        </View>
    )
}

export default ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose />,
        headerTitle: ()=> <HeaderTitle label={['Recent Outgoing Transfer']} />,
    })

    const recentTransfer = route.params.recentTransfer
    const walletinfo = route.params.walletinfo

    const TransferAgain = ()=> {
        return navigation.navigate("ToktokWalletSendMoney", {walletinfo , recentTransfer})
    }

    return (
        <>
              <Separator />
              <View style={styles.container}>
                    <View style={{flex: 1}}>
                        <Details label="Date" value={moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD, YYYY')}/>
                        <Details label="Time" value={moment(recentTransfer.createdAt).tz('Asia/Manila').format('h:mm a')}/>
                        <Details label="Payment Method" value="toktokwallet"/>
                        <Details label="Recipient" value={`${recentTransfer.destinationInfo.firstName} ${recentTransfer.destinationInfo.middleName ? recentTransfer.destinationInfo.middleName + " " : ""}${recentTransfer.destinationInfo.lastName}`}/>
                        <Details label="Fund Transferred" value={`PHP ${numberFormat(recentTransfer.amount)}`}/>
                    </View>
                    <View style={{flex: 1,height: 70,justifyContent:"flex-end"}}>
                            <YellowButton label="Transfer Again" onPress={TransferAgain} />
                    </View>
                   
              </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        paddingHorizontal: 16,
    },
    details: {
        paddingVertical: 15,
        flexDirection:'row',
        borderBottomWidth: 1,
        borderColor:"#F4F4F4"
    },
    label: {
        justifyContent: "center",
        alignItems:'flex-start',
        flex:1 ,
    },
    value: {
        justifyContent: "center",
        alignItems:'flex-end',
        flex: 1,
    },
    labelText: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.M,
        color: COLORS.DARK
    },
    valueText: {
        fontFamily:  FONTS.BOLD,
        fontSize: SIZES.M,
        color: COLORS.DARK
    }
})