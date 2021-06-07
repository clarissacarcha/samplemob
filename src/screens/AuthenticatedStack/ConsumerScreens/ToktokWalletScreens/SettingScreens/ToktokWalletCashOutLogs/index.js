import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator , FlatList} from 'react-native'
import {SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import moment from 'moment'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import {useLazyQuery,useQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_LOGS, GET_CASH_OUT_LOGS,TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_CASH_OUTS} from '../../../../../../graphql/toktokwallet'
import {onError} from '../../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../../helper'
import {Separator , FilterDateModal , TransactionDetails} from '../../Components'
import { HeaderBack , HeaderTitle } from '../../../../../../revamp'
import { MaskLeftZero } from '../../../../../../util/HelperUtility'


const CashOutLog = ({
    item,
    index , 
    itemsLength ,
    setTransactionInfo,
    setTransactionVisible 
})=> {


    const ViewTransactionDetails = (refNo,refDate, transactionAmount , status)=> {
        setTransactionInfo({
            refNo: refNo,
            refDate: refDate,
            label: "Cash Out",
            phrase: "Cash-out through GCash",
            amount: transactionAmount,
            status: status,
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
    const transactionAmount = `PHP ${numberFormat(item.amount)}`


    return (
        <TouchableOpacity onPress={()=>ViewTransactionDetails(refNo,refDate, transactionAmount , status)} style={styles.transaction}>
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

const ToktokWalletCashOutLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash Out','']}/>,
    })

    const session = useSelector(state=>state.session)
    
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

    const [getCashOuts ,{ data ,error , loading }] = useLazyQuery(GET_CASH_OUTS , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getCashOuts})=> {
            setRecords(state=> [...state , ...getCashOuts])
            setPageLoading(false)
        }
    })

    useEffect(()=>{
        getCashOuts({
            variables: {
                input: {
                    pageIndex: pageIndex
                }
            }
        })
    },[pageIndex])

    return (
        <>
          <TransactionDetails 
            visible={transactionVisible}
            setVisible={setTransactionVisible}
            refNo={transactionInfo.refNo}
            refDate={transactionInfo.refDate}
            label={transactionInfo.label}
            phrase={transactionInfo.phrase}
            amount={transactionInfo.amount}
            status={transactionInfo.status}
        />
        <Separator />
        {
            loading
            ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
               </View>
            : <View style={styles.container}>
                    <View style={styles.content}>
                        
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={records}
                                keyExtractor={item=>item.id}
                                renderItem={({item,index})=>(
                                    <CashOutLog 
                                        key={`cashin-log${index}`} 
                                        item={item}
                                        index={index} 
                                        itemsLength={records.length}
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

export default ToktokWalletCashOutLogs
