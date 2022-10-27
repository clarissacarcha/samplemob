import React , {useState, useEffect} from 'react'
import {View,StyleSheet,Text,Dimensions,ActivityIndicator,FlatList} from 'react-native'
import { numberFormat } from 'toktokwallet/helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator,
    CheckIdleState
} from 'toktokwallet/components'
import { SomethingWentWrong } from 'src/components'
import {useSelector} from 'react-redux'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CASH_OUT_PROVIDERS } from 'toktokwallet/graphql'
import { useQuery } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import CashOutOption from "./CashOutOption";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const {height,width} = Dimensions.get("window")

export const ToktokWalletCashOut = ({navigation, route})=> {

    navigation.setOptions({
       headerShown: false
    })
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const alert = useAlert()
    const screenLabel = route.params ? route.params.screenLabel : null

    const {data,error,loading} = useQuery(GET_CASH_OUT_PROVIDERS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onError: (error)=> {
            onErrorAlert({alert,error,navigation})
        },
        onCompleted: ({getCashOutProviders})=> {
    
        }
    })


    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
    }

    if(error){
        return <SomethingWentWrong />;
    }
  

    return (
     <CheckIdleState>
      <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label={screenLabel ?? "Fund Transfer"} />
                    <View style={styles.walletBalance}>
                        <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,marginBottom: 5}}>Available Balance</Text>
                    </View>
                </HeaderImageBackground>
            </View>

            <View style={styles.cashoutoptions}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Enrolled Accounts</Text>
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
      </CheckIdleState>
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
