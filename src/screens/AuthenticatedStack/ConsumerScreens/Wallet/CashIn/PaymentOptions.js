import React from 'react'
import {View,StyleSheet,Text,Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FIcon from 'react-native-vector-icons/Feather'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../components'
import { FONT_LIGHT, FONT_MEDIUM } from '../../../../../res/constants'

const PaymentOptions = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <View style={{width: 50, justifyContent: "center", marginLeft: 10}}>
        //                     <FIcon5 name="times" size={25}/>
        //                 </View>,
        headerLeft: ()=> <HeaderBack icon="x"/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    return (
        <View style={styles.container}>
                <TouchableOpacity style={styles.cashinoption} onPress={()=>navigation.navigate("TokTokWalletCashInPaypanda",{walletId: route.params.walletId,balance: route.params.balance})}>
                    <View style={styles.logo}>
                        <Image style={{height: 30,width: 30}} resizeMode="contain" source={require('../../../../../assets/images/paypanda.png')} />
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:14,fontFamily: FONT_MEDIUM}}>PayPanda</Text>
                        <Text style={{fontSize: 12, fontFamily: FONT_LIGHT}}>Use PayPanda to cash-in</Text>
                    </View>
                    <View style={styles.arrowright}>
                           <FIcon name={'chevron-right'} color={"#A6A8A9"}/>
                    </View>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    cashinoption: {
        padding: 10,
        paddingVertical: 20,
        borderWidth: 0.5,
        borderColor: "silver",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    arrowright: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

export default PaymentOptions