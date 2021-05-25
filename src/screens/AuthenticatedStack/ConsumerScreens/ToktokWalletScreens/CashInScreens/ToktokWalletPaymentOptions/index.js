import React from 'react'
import {View,StyleSheet,Text,Image,FlatList,Alert,ActivityIndicator} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FIcon from 'react-native-vector-icons/Feather'
import {COLOR , FONT, FONT_SIZE} from '../../../../../../res/variables'
import {useQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_CASH_IN_PROVIDERS} from '../../../../../../graphql/toktokwallet'
import {Separator,HeaderImageBackground,HeaderTitle} from '../../Components'
import { numberFormat } from '../../../../../../helper'
import {useSelector} from 'react-redux'

const ToktokWalletPaymentOptions = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const walletinfo = route.params.walletinfo
    const tokwaAccount = useSelector(state=>state.toktokWallet)

    const {data: cashinmethods,error,loading} = useQuery(GET_CASH_IN_PROVIDERS,{
            client: TOKTOK_WALLET_GRAPHQL_CLIENT,
            fetchPolicy: 'network-only',
            onCompleted: ({getCashInProviders})=> {
                console.log(getCashInProviders)
            }
    })

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if(error){
        console.log(error)
    }

    const CashInMethod = ({item,index})=> {
        let image , navigateLink
        if(item.name.toLowerCase() == "paypanda"){
            image = require('../../../../../../assets/toktokwallet-assets/cash-in-providers/paypanda.png')
            navigateLink = "ToktokWalletPayPandaForm"
        }else{
            navigateLink = ""
        }
        return (
            <TouchableOpacity 
                key={`cashin-${index}`}
                style={styles.cashinoption} onPress={()=> navigateLink != "" ? navigation.navigate(navigateLink,{
                        walletinfo: route.params.walletinfo,
                        transactionType: item
                    }
                ) : Alert.alert("","Temporary Unavailable")}>
                <View style={styles.logo}>
                    <Image style={{height: 35,width: 35}} resizeMode="contain" source={image} />
                </View>
                <View style={styles.name}>
                    <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{item.name}</Text>
                    <Text style={{fontSize: FONT_SIZE.S, fontFamily: FONT.REGULAR}}>Use {item.name} to cash in</Text>
                </View>
                <View style={styles.arrowright}>
                    <FIcon name={'chevron-right'} size={20} color={"#A6A8A9"}/>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
                      <View style={styles.headings}>
                            <HeaderImageBackground>
                                <HeaderTitle label="Cash In"/>
                                <View style={styles.walletBalance}>
                                        <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,color: COLOR.DARK}}>Available Balance</Text>
                                </View>
                            </HeaderImageBackground>
                      </View>

                      <View style={styles.paymentoptions}>
                            <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Choose cash-in method</Text>
                      </View>
                      <Separator/>     
                       <FlatList 
                            data={cashinmethods.getCashInProviders}
                            keyExtractor={(item)=>item.id}
                            renderItem={CashInMethod}
                        />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
    walletBalance: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    paymentoptions: {
        padding: 16,
    },
    cashinoption: {
        padding: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: "#F4F4F4",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start"
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

export default ToktokWalletPaymentOptions

