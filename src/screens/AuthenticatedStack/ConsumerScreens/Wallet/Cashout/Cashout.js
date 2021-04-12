import React , {useState, useEffect} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Dimensions} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants';
import { numberFormat } from '../../../../../helper';

const {height,width} = Dimensions.get("window")

const Cashout = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Cash out','']}/>,
    })

    const [percentage,setPercentage] = useState(100)

    useEffect(()=>{
        setPercentage(()=>{
            let rawPercentage = (( route.params.walletinfo.balance - route.params.walletinfo.balance ) / route.params.walletinfo.balance ) * 100
            return 100 - rawPercentage
        })
    },[])

    const SettingOption = ({route,icon,title,iconSize , params={}})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route, params)}>
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
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM}}>Transferable Balance</Text>
                <Text style={{fontSize: 20,color:"#F6841F",marginVertical: 5,fontFamily: FONT_MEDIUM}}>{'\u20B1'} {numberFormat(route.params.walletinfo.balance)}</Text>

                <View style={{
                    width: width * 0.7,
                    height: 6,
                    borderRadius: 6,
                    backgroundColor:'#CFCFCF',
                    marginVertical: 5,
                    position:"relative"
                }}>

                    <View style={{
                        position:"absolute",
                        height:"100%",
                        width:`${percentage}%`,
                        borderRadius: 6,
                        backgroundColor:"orange"
                    }}/>

                </View>

                <Text style={{fontSize: 12,color:"gray",fontFamily: FONT_REGULAR}}>Total toktok wallet balance {'\u20B1'} {numberFormat(route.params.walletinfo.balance)}</Text>
          </View>
          <View style={styles.transferOptions}>
                <SettingOption route="TokTokWalletGcashEncashment" params={{walletinfo: route.params.walletinfo}} iconSize={{height: 40, width: 40}} icon={require('../../../../../assets/icons/gcash.png')} title="Encash to Gcash"/>
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