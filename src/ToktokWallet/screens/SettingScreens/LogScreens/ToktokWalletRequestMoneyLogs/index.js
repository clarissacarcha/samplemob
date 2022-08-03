import React from 'react'
import { View , Text , StyleSheet ,FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import {Separator , CheckIdleState , NoData , SwipeDownToRefresh } from 'toktokwallet/components'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { onErrorAlert} from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {useQuery} from '@apollo/react-hooks'
import {  GET_REQUEST_MONEY_HISTORY } from 'toktokwallet/graphql'
import { SomethingWentWrong } from 'src/components'
import { useAccount } from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants';
//SELF IMPORTS 
import {
    RenderItem
} from "./Components"


const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const ToktokWalletRequestMoneyLogs = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Request Money History']} />,
    })
    const { tokwaAccount } = useAccount();
    const {data ,error ,loading,refetch} = useQuery(GET_REQUEST_MONEY_HISTORY, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        variables: {
            input: {
                status: null
            }
        }
    })

    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={24} color={COLOR.YELLOW} />
                </View>
    }

    if(error){
        return <SomethingWentWrong />
    }


    return (
        <CheckIdleState>
            <Separator/>
            <SwipeDownToRefresh/>
            <FlatList
                ListHeaderComponent={() => {
                    if(data.getRequestMoneyHistory.length > 0) return null
                    if(loading) return null
                    return <NoData/>
                }}
               style={styles.container}
               showsVerticalScrollIndicator={false}
               data={data.getRequestMoneyHistory}
               keyExtractor={(item) => item.id}
               renderItem={({item,index})=><RenderItem item={item} index={index} tokwaAccount={tokwaAccount}/>}
               ItemSeparatorComponent={() => (
                <View style={{borderBottomWidth: 1.5, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
                )}
                refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
            />

        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    }
})