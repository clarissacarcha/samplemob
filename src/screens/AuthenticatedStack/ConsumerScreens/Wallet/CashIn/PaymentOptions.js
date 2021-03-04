import React from 'react'
import {View,StyleSheet,Text,Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../components'

const PaymentOptions = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <View style={{width: 50, justifyContent: "center", marginLeft: 10}}>
        //                     <FIcon5 name="times" size={25}/>
        //                 </View>,
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    return (
        <View style={styles.container}>
                <TouchableOpacity style={styles.cashinoption} onPress={()=>navigation.navigate("TokTokWalletCashInPaypanda",{walletId: route.params.walletId,balance: route.params.balance})}>
                    <View style={styles.logo}>
                        <Image style={{height: 30,width: 30}} resizeMode="contain" source={require('../../../../../assets/images/paypanda.png')} />
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:16}}>PayPanda</Text>
                        <Text style={{fontSize: 12, color: "gray"}}>Use PayPanda to cash-in</Text>
                    </View>
                    <View style={styles.arrowright}>
                           <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text>
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