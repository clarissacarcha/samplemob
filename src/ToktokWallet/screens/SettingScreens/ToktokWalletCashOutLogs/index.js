import React , {useState , useEffect} from 'react'
import {View,StyleSheet,ActivityIndicator , FlatList , RefreshControl , Dimensions} from 'react-native'
import {useLazyQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_CASH_OUTS} from 'toktokwallet/graphql'
import {useSelector} from 'react-redux'
import {Separator , CheckIdleState , SwipeDownToRefresh ,NoData} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'

//SELF IMPORT
import {
    CashOutLog
} from "./Components"

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const imageWidth = Dimensions.get('window').width - 200;


export const ToktokWalletCashOutLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Fund Transfer','']}/>,
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [records,setRecords] = useState([])
    const [pageIndex,setPageIndex] = useState(0)
    const [pageLoading,setPageLoading] = useState(false)
    const alert = useAlert()

    
    const [getCashOuts, { data, error, loading }] = useLazyQuery(GET_CASH_OUTS , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error) => {
            onErrorAlert({alert,error,navigation})
        },
        onCompleted: ({getCashOuts})=> {
            // setRecords(state=> [...state , ...getCashOuts])
            setRecords(getCashOuts)
            setPageLoading(false)
        }
    })

    const Refetch = ()=> {
        getCashOuts()
    }

    useEffect(()=>{
        getCashOuts()
    },[])

    if(error){
        return <SomethingWentWrong onRefetch={Refetch} />
    }

    return (
        <CheckIdleState>
        <Separator />
        <SwipeDownToRefresh/>
        {
            // loading
            // ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            //     <ActivityIndicator size={24} color={COLOR.YELLOW} />
            //    </View>
            // : 
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                        ListHeaderComponent={() => {
                            if(records.length > 0) return null
                            if(loading) return null
                            return <NoData/>
                        }}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={Refetch} colors={[COLOR.YELLOW]} tintColor={COLOR.YELLOW} />}
                        showsVerticalScrollIndicator={false}
                        data={records}
                        keyExtractor={item=>item.id}
                        renderItem={({item,index})=>(
                            <CashOutLog 
                                key={`cashin-log${index}`} 
                                item={item}
                                index={index} 
                                tokwaAccount={tokwaAccount}
                            />
                        )}
                        // onEndReached={()=>{
                        //     setPageLoading(true)
                        //     setPageIndex(state=>state+1)
                        // }}
                        // onEndReachedThreshold={10}
                    />
                    {
                        pageLoading &&  <View style={{justifyContent:"center",alignItems:"center",paddingHorizontal: 10,}}>
                                            <ActivityIndicator color={COLOR.YELLOW}/>
                                        </View>
                    }
                </View>
            </View>
        }
        </CheckIdleState>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        padding: 16,
        flex: 1,
    },
    filterType: {
        alignSelf: "flex-end",
        padding: 5, 
        paddingHorizontal: 15, 
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 10
    },
    transactionLogsContainer: {
        marginVertical: 5
    },
    transaction: {
        paddingVertical: 10,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection: "row"
    },
    transactionIcon: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    }
})

