import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator , FlatList,RefreshControl} from 'react-native'
import moment from 'moment'
import {useLazyQuery , useQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_LOGS ,TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CASH_INS} from 'toktokwallet/graphql'
import {useSelector} from 'react-redux'
import { numberFormat } from 'toktokwallet/helper'
import {Separator,TransactionDetails, ModalPaginationLoading} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle} from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const CashInLog = ({
    item,
    index , 
    itemsLength,
    tokwaAccount,
    setTransactionInfo,
    setTransactionVisible
})=> {


    const ViewTransactionDetails = ({refNo,refDate, transactionAmount , status,provider , requestNo})=> {
        setTransactionInfo({
            refNo: refNo,
            refDate: refDate,
            label: "Cash In",
            phrase: `Cash in through ${provider}`,
            amount: transactionAmount,
            status: status,
            requestNo,
        })
        setTransactionVisible(true)
    }

    let status
    switch (item.status) {
        case "0":
            status = "Requested"
            break;
        case "1":
            status = "Success"
            break
        case "2":
            status = "Pending"
            break
        default:
            status = "Failed"
            break;
    }
    const transaction = item.transaction
    const requestNo = item.referenceNumber
    const refNo = transaction?.refNo ? transaction.refNo : null
    const refDate = transaction ? moment(transaction.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a') : moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`
    const provider = item.provider.name


    return (
        <TouchableOpacity
            onPress={()=>ViewTransactionDetails({
                refNo,
                refDate,
                transactionAmount ,
                status , 
                provider , 
                requestNo
            })} 
            style={styles.transaction}
        >
            <View style={styles.transactionDetails}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Request # {requestNo}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.M,marginTop: 0,fontFamily: FONT.REGULAR}}>{status}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={{color: "#FCB91A",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
            </View>
       </TouchableOpacity>
    )
}

export const ToktokWalletCashInLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [transactionVisible,setTransactionVisible] = useState(false)
    const [pageIndex,setPageIndex] = useState(0)
    const [pageLoading,setPageLoading] = useState(false)
    const [records,setRecords] = useState([])
    const [transactionInfo,setTransactionInfo] = useState({
        refNo: "",
        refDate: "",
        label: "",
        phrase: "",
        amount: "",
        status: "",
    })

    const alert = useAlert()

    const [getCashIns, {data, error, loading}] = useLazyQuery(GET_CASH_INS, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error) => {
            onErrorAlert({ alert, error })
        },
        onCompleted: ({getCashIns})=> {
            // setRecords(state=> {
            //     return [...state, ...getCashIns]
            // })
            // setPageLoading(false)
            setRecords(getCashIns)
        }
    })

    const Refetch = ()=> {
        getCashIns()
        setPageLoading(loading)
    }

    useEffect(()=>{
        getCashIns()
        setPageLoading(loading)
    },[])

    if(error){
        return <SomethingWentWrong onRefetch={Refetch} />
    }

    return (
        <>
        <TransactionDetails 
            visible={transactionVisible}
            setVisible={setTransactionVisible}
            transactionInfo={transactionInfo}
            cashInMobileNumber={tokwaAccount.mobileNumber}
        />
        <Separator />
        <ModalPaginationLoading visible={pageLoading}/>
        {
            // loading && pageIndex == 0
            // ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            //     <ActivityIndicator size={24} color={COLOR.YELLOW} />
            //    </View>
            // :  
            <View style={styles.container}>
                    <View style={styles.content}>
                            <FlatList
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={Refetch} colors={[COLOR.YELLOW]} tintColor={COLOR.YELLOW} />}
                                showsVerticalScrollIndicator={false}
                                data={records}
                                keyExtractor={item=>item.id}
                                renderItem={({item,index})=>(
                                    <CashInLog 
                                        key={`cashin-log${index}`} 
                                        item={item}
                                        index={index} 
                                        itemsLength={records.length}
                                        tokwaAccount={tokwaAccount}
                                        setTransactionInfo={setTransactionInfo}
                                        setTransactionVisible={setTransactionVisible}
                                    />
                                )}
                                // onEndReached={()=>{
                                //   if(!pageLoading) {
                                //     console.log("REACH END")
                                //     setPageIndex(state=>state+1)
                                //   }
                                // }}
                                // onEndReachedThreshold={0.16}
                            />
                    </View>
            </View>
        }
       
        </>
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
       flex: 1
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
        marginVertical: 0
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
