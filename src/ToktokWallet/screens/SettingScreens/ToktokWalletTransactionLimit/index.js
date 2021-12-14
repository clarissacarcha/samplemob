import React from 'react'
import {View,Text,StyleSheet,ActivityIndicator,FlatList} from 'react-native'
import { HeaderBack, HeaderTitle } from 'src/revamp'
import { Separator , CheckIdleState } from 'toktokwallet/components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_ACCOUNT_TYPES } from 'toktokwallet/graphql'
import {useQuery} from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import { numberFormat } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const TransactionLimit = ({type, incoming, outgoing})=> {
    return (
        <View style={{flexDirection:"row",height: 40,justifyContent:"center",alignItems:'center',padding: 10,backgroundColor:"#FEF7E6"}}>
                <View style={{flex: 1}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{type}</Text>
                </View>
                <View style={{flex: 1}}>
                { incoming && incoming > 0 ? <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>PHP {numberFormat(incoming)}</Text> : <Text>-</Text>}
                </View>
                <View style={{flex: 1}}>
                { outgoing && outgoing > 0 ? <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>PHP {numberFormat(outgoing)}</Text> : <Text>-</Text>}
                </View>
        </View>
    )
}


const AccountTypeLimit = ({item,index})=> {

    return (
        <View style={{marginBottom: 20,}}>
            <View style={{backgroundColor: COLOR.YELLOW,height: 40,justifyContent:"center",padding: 10,borderRadius: 2}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{item.title}</Text>
            </View>
            <View style={{flexDirection:"row",height: 40,justifyContent:"center",alignItems:'center',padding: 10,backgroundColor:"#FEF7E6"}}>
                    <View style={{flex: 1}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Wallet Size</Text>
                    </View>
                    <View style={{flex: 1}}>
                       { item.walletSize && item.walletSize > 0 ? <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>PHP {numberFormat(item.walletSize)}</Text> : <Text>-</Text>}
                    </View>
                    <View style={{flex: 1}}>

                    </View>
            </View>
            <View style={{flexDirection:"row",height: 40,justifyContent:"center",alignItems:'center',padding: 10,backgroundColor:"#F7F7FA"}}>
                    <View style={{flex: 1}}>

                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Incoming</Text>
                    </View>
                    <View style={{flex: 1}}>
                         <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Outgoing</Text>
                    </View>
            </View>

           <TransactionLimit type="Daily" incoming={item.incomingValueDailyLimit} outgoing={item.outgoingValueDailyLimit}/>
           <TransactionLimit type="Monthly" incoming={item.incomingValueMonthlyLimit} outgoing={item.outgoingValueMonthlyLimit}/>
           <TransactionLimit type="Annual" incoming={item.incomingValueAnnualLimit} outgoing={item.outgoingValueAnnualLimit}/>

        </View>
   
    )
}


export const ToktokWalletTransactionLimit = ({navigation})=> {


    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Transaction Limit','']}/>,
    })

    const alert = useAlert()

    const {data,error,loading} = useQuery(GET_ACCOUNT_TYPES, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error,navigation})
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                    <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }

    if(error){
        return null
    }


    return (
        <CheckIdleState>
        <Separator/>
        <View style={styles.container}>
                <FlatList 
                        showsVerticalScrollIndicator={false}
                        data={data.getAccountTypes}
                        keyExtractor={item=>item.id}
                        renderItem={AccountTypeLimit}
                />
        </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    }
})


