import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants';
import { numberFormat } from '../../../../../helper';

const Cashout = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack icon="x"/>,
        headerTitle: ()=> <HeaderTitle label={['Cash out','']}/>,
    })

    const SettingOption = ({route,icon,title,iconSize})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: iconSize.height, width: iconSize.width}} resizeMode="contain"/>
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:14,fontFamily: FONT_MEDIUM}}>{title}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={16} color={"#A6A8A9"} /> 
                    </View>
        </TouchableOpacity>
    )

    return (
      <View style={styles.container}>
          <View style={styles.transferDetails}>
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM}}>Available Balance</Text>
                <Text style={{fontSize: 20,color:"#F6841F",marginVertical: 5,fontFamily: FONT_MEDIUM}}>{'\u20B1'} {numberFormat(route.params.balance)}</Text>
                <Text style={{fontSize: 12,color:"gray",fontFamily: FONT_REGULAR}}>Total toktok encash available balance {'\u20B1'} {numberFormat(route.params.balance)}</Text>
          </View>
          <View style={styles.transferOptions}>
                <SettingOption route="TokTokWalletActionsSend" iconSize={{height: 40, width: 40}} icon={require('../../../../../assets/icons/gcash.png')} title="Encash to Gcash"/>
                {/* <SettingOption route="TokTokWalletActionsSend" icon={require('../../../../../assets/icons/walletPin.png')} title="Send to Contacts"/>
                <SettingOption route="TokTokWalletActionsTransferEwallet" icon={require('../../../../../assets/icons/walletSendEwallet.png')} title="Send to E-wallet"/>
                <SettingOption route="TokTokWalletSettingsCreatePIN" icon={require('../../../../../assets/icons/walletSendBank.png')} title="Send to Bank Account"/> */}
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"silver",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
        paddingHorizontal: 15,
    },
    settingoption: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 0.2,
        borderColor: "silver",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    name: {
        flex: 1,
        justifyContent: "center",
        alignItems:"flex-start",
    },
    arrowright: {
        justifyContent: "center",
        alignItems: "flex-end",
    }
})

export default Cashout