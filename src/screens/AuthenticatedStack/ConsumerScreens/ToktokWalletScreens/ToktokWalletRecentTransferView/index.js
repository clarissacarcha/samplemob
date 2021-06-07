import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import { COLOR , FONT , FONT_SIZE } from '../../../../../res/variables'
import {Separator} from '../Components'
import moment from 'moment'
import { numberFormat } from '../../../../../helper'
import { HeaderBack, YellowButton , HeaderTitle } from '../../../../../revamp'
import {useSelector} from 'react-redux'

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

const ToktokWalletRecentTransferView = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Outgoing Transfer']} />,
    })

    const recentTransfer = route.params.recentTransfer
    const tokwaAccount = useSelector(state=>state.toktokWallet)

    const TransferAgain = ()=> {
        return navigation.navigate("ToktokWalletSendMoney", {recentTransfer})
    }

    return (
        <>
              <Separator />
              <View style={styles.container}>
                    <View style={{flex: 1}}>
                        <Details label="Date" value={moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD, YYYY')}/>
                        <Details label="Time" value={moment(recentTransfer.createdAt).tz('Asia/Manila').format('h:mm a')}/>
                        {/* <Details label="Payment Method" value="toktokwallet"/> */}
                        <Details label="Recipient" value={`${recentTransfer.destinationPerson.firstName} ${recentTransfer.destinationPerson.middleName ? recentTransfer.destinationPerson.middleName + " " : ""}${recentTransfer.destinationPerson.lastName}`}/>
                        <Details label="Fund Transferred" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(recentTransfer.amount)}`}/>
                        <Details label="Note" value={recentTransfer.note}/>
                    </View>
                    <View style={{flex: 1,height: 70,justifyContent:"flex-end",paddingBottom: 16,}}>
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
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
    },
    valueText: {
        fontFamily:  FONT.BOLD,
        fontSize: FONT_SIZE.M,
    }
})

export default ToktokWalletRecentTransferView