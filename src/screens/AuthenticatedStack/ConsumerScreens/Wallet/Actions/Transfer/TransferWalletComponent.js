import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants';

const TransferWalletComponent = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack icon="x"/>,
        headerTitle: ()=> <HeaderTitle label={['Transfer','']}/>,
    })

    const SettingOption = ({route,icon,title})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: 25, width: 25}} resizeMode="contain"/>
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
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM}}>Transferable Balance</Text>
                <Text style={{fontSize: 20,color:"#F6841F",marginVertical: 5,fontFamily: FONT_MEDIUM}}>{'\u20B1'} 2000.00</Text>
                <Text style={{fontSize: 12,color:"gray",fontFamily: FONT_REGULAR}}>Total ToktokPay  balance {'\u20B1'} 2500.00</Text>
          </View>
          <View style={styles.transferOptions}>
                <SettingOption route="TokTokWalletActionsSend" icon={require('../../../../../../assets/icons/walletPin.png')} title="Send to Contacts"/>
                <SettingOption route="TokTokWalletActionsTransferEwallet" icon={require('../../../../../../assets/icons/walletSendEwallet.png')} title="Send to E-wallet"/>
                <SettingOption route="TokTokWalletSettingsCreatePIN" icon={require('../../../../../../assets/icons/walletSendBank.png')} title="Send to Bank Account"/>
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
        flexBasis: 40,
        justifyContent: "center",
        alignItems: "flex-start"
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

export default TransferWalletComponent