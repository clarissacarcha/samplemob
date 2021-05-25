import React , {useState, useEffect} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Dimensions, ImageBackground,ActivityIndicator,FlatList} from 'react-native'
import FIcon from 'react-native-vector-icons/Feather';
import { COLOR , FONT , FONT_SIZE  } from '../../../../../../res/variables';
import { numberFormat } from '../../../../../../helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from '../../Components'
import {useSelector} from 'react-redux'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_CASH_OUT_PROVIDERS } from '../../../../../../graphql/toktokwallet'
import { useQuery } from '@apollo/react-hooks'

//SELF IMPORTS
import CashOutOption from "./CashOutOption";
import GCash from "./GCash"

const {height,width} = Dimensions.get("window")

const ToktokWalletCashOut = ({navigation,route})=> {

    navigation.setOptions({
       headerShown: false
    })
    
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const walletinfo = route.params.walletinfo

    const {data,error,loading} = useQuery(GET_CASH_OUT_PROVIDERS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getCashOutProviders})=> {
    
        }
    })


    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
    }
  

    return (
     <>
      <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label="Cash Out"/>
                    <View style={styles.walletBalance}>
                                <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                    </View>
                </HeaderImageBackground>
            </View>

            <View style={styles.cashoutoptions}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Choose cash-out method</Text>
            </View>
            <Separator/>
            <View style={styles.transferOptions}>
                     <FlatList 
                            data={data.getCashOutProviders}
                            keyExtractor={(item)=>item.id}
                            renderItem={({item,index})=> {
                                    return <CashOutOption item={item}/>
                            }}
                        />
            </View>
      </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
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
    cashoutoptions: {
        padding: 16,
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"#F4F4F4",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
        paddingHorizontal: 16,
    },
})

export default ToktokWalletCashOut