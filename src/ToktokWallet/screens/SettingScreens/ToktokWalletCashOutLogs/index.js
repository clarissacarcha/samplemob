import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator , FlatList , RefreshControl} from 'react-native'
import moment from 'moment'
import {useLazyQuery,useQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_LOGS, GET_CASH_OUT_LOGS,TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_CASH_OUTS} from 'toktokwallet/graphql'
import {useSelector} from 'react-redux'
import { numberFormat ,MaskLeftZero } from 'toktokwallet/helper'
import {Separator , FilterDateModal , TransactionDetails} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const CashOutLog = ({
    item,
    index , 
    itemsLength ,
    tokwaAccount,
    setTransactionInfo,
    setTransactionVisible 
})=> {


    const ViewTransactionDetails = ({refNo,refDate, transactionAmount , status,provider,cashOutDisplayInformations})=> {
        let phrase = `${provider}`
        if(provider == "InstaPay" || provider == "PesoNet"){
            phrase = "Other Banks"
        }
        setTransactionInfo({
            refNo: refNo,
            refDate: refDate,
            label: "Cash Out",
            phrase: phrase,
            amount: transactionAmount,
            status: status,
            cashOutDisplayInformations: cashOutDisplayInformations,
        })
        setTransactionVisible(true)
    }

    let status
    switch (item.status) {
        case "0":
            status = "Pending"
            break;
        case "1":
            status = "Processed"
            break
        case "2":
            status = "Pending"
            break
        case "3":
            status = "Rejected"
            break
        default:
            status = "Rejected"
            break;
    }

    const refNo = MaskLeftZero(item.id)
    const refDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
    const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`
    const provider = item.provider.name
    const cashOutDisplayInformations = item.cashOutDisplayInformations

    // console.log(item.cashOutDisplayInformations)


    return (
        <TouchableOpacity onPress={()=>ViewTransactionDetails({refNo,refDate, transactionAmount , status , provider,cashOutDisplayInformations})} style={styles.transaction}>
            <View style={styles.transactionDetails}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Ref # {refNo}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.M,marginTop: 0,fontFamily: FONT.REGULAR}}>{status}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={{color: "#FCB91A",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
                <Text style={{color: "#909294",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const ToktokWalletCashOutLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash Out','']}/>,
    })

    const session = useSelector(state=>state.session)

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [records,setRecords] = useState([])
    const [pageIndex,setPageIndex] = useState(0)
    const [pageLoading,setPageLoading] = useState(false)
    const [transactionVisible,setTransactionVisible] = useState(false)
    const [transactionInfo,setTransactionInfo] = useState({
        refNo: "",
        refDate: "",
        label: "",
        phrase: "",
        amount: "",
        status: "",
    })
    const alert = useAlert()
    const [getCashOuts, { data, error, loading }] = useLazyQuery(GET_CASH_OUTS , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error) => {
            onErrorAlert({alert,error})
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
        <>
        <TransactionDetails 
            visible={transactionVisible}
            setVisible={setTransactionVisible}
            transactionInfo={transactionInfo}
            displayNumber=""
        />
        <Separator />
        {
            // loading
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
                            <CashOutLog 
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

