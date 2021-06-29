import React, {useState,useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator,RefreshControl} from 'react-native'
import { COLOR , FONT , FONT_SIZE} from '../../../../../res/variables'
import moment from 'moment'
import {onError, onErrorAlert} from '../../../../../util/ErrorUtility'
import {Separator,WalletLog,FilterDateModal} from '../Components'
import { HeaderBack , HeaderTitle } from '../../../../../revamp'
import { useAlert } from '../../../../../hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql'
import { GET_TRANSACTIONS } from '../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { useSelector , connect } from 'react-redux'

const ToktokWalletTransactions = ({navigation,route,getTokwaTransactions})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Transactions']} />,
    })

    const [allTransactions, setAllTransactions] = useState(route.params.allTransactions)
    const [pageLoading,setPageLoading] = useState(false)
    const alert = useAlert()

    const [getTransactions , {data, error ,loading}] = useLazyQuery(GET_TRANSACTIONS, {
        fetchPolicy: 'network-only',
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getTransactions})=>{
            setAllTransactions(state=>{
                return [...getTransactions.allTransactions]
            })
            getTokwaTransactions(getTransactions)
            setPageLoading(false)
        },
        onError: (error)=> {
            onErrorAlert({alert ,error})
        }
    })

    const Refetch = ()=> {
        getTransactions()
    }

    // useEffect(()=>{
    //     if(pageIndex > 0){
    //         // call pagination here
    //         getTransactions()
    //     }
    // },[pageIndex])

    return (
        <>
        <Separator />
        <View style={styles.container}>        
                <View style={styles.logs}>
                        <FlatList 
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={Refetch} colors={[COLOR.YELLOW]} tintColor={COLOR.YELLOW} />}
                            showsVerticalScrollIndicator={false}
                            data={allTransactions}
                            keyExtractor={(item)=>item.id}
                            renderItem={({item,index})=>(
                                <WalletLog key={`recentLog${index}`} item={item} itemsLength={allTransactions} index={index}/>
                            )}
                            // onEndReached={()=>{
                            //     setPageLoading(true)
                            //     setPageIndex(state=>state+1)
                            // }}
                            // onEndReachedThreshold={2}
                            scrollEnabled={true}
                        />
                </View>
        </View>
            
       </>
    )
}

const mapDispatchtoProps = (dispatch) => ({
    getTokwaTransactions: (payload) => dispatch({
        type: "SET_TOKTOKWALLET_TRANSACTIONS",
        payload: payload
    })
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
    logs: {
        // marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    filterType: {
        alignSelf: "flex-end",
        padding: 2, 
        paddingHorizontal: 15, 
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 5
    },
})

export default connect(null, mapDispatchtoProps)(ToktokWalletTransactions)