import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator , FlatList} from 'react-native'
import {HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import moment from 'moment'
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../../res/constants'
import {useLazyQuery , useQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_LOGS ,TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_CASH_INS} from '../../../../../../graphql/toktokwallet'
import {onError} from '../../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../../helper'
import {Separator,FilterDateModal,TransactionDetails} from '../../Components'
import { HeaderBack } from '../../../../../../revamp'


const CashInLog = ({
    transactionDate , 
    transactionItems ,
    index , 
    itemsLength,
    setTransactionInfo,
    setTransactionVisible
})=> {

    const dateValue = moment(transactionDate).tz("Asia/Manila").format("YYYY-MM-DD");
    const phTodayDate = moment().tz("Asia/Manila").format("YYYY-MM-DD");
    const phYesterdayDate = moment().subtract(1,"days").tz("Asia/Manila").format("YYYY-MM-DD");
    let datedisplay = ''
    if(dateValue == phTodayDate){
      datedisplay = "Today"
    }else if(dateValue == phYesterdayDate){
        datedisplay = "Yesterday"
    }else{
        datedisplay = moment(transactionDate).tz("Asia/Manila").format('MMM DD YYYY');
    }

    const ViewTransactionDetails = (refNo,refDate, transactionAmount , status)=> {
        setTransactionInfo({
            refNo: refNo,
            refDate: refDate,
            label: "Cash In",
            phrase: "Cash-in through PayPanda",
            amount: transactionAmount,
            status: status,
        })
        setTransactionVisible(true)
    }

    return (
        <View style={[styles.transactionLogsContainer, {marginBottom: index == itemsLength - 1 ? 100 : 0}]}>
            <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>{datedisplay}</Text>
           {
               transactionItems.map((item)=>{
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

                const refNo = item.referenceNumber
                const refDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
                const transactionAmount = `PHP ${numberFormat(item.amount)}`

                return (
                    <>
                    {
                        // item.trails[0].status != 0 &&
                        <TouchableOpacity onPress={()=>ViewTransactionDetails(refNo,refDate, transactionAmount , status)} style={styles.transaction}>
                            <View style={styles.transactionDetails}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>Ref # {refNo}</Text>
                                <Text style={{color: "#909294",fontSize: SIZES.M,marginTop: 0,fontFamily: FONTS.REGULAR}}>{status}</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{color: "#FCB91A",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{transactionAmount}</Text>
                                <Text style={{color: "#909294",fontSize: SIZES.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONTS.REGULAR}}>{refDate}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                
                    </>
                )
               })
           }
        </View>
    )
}

const ToktokWalletCashInLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In Logs','']}/>,
    })


    const [transactionVisible,setTransactionVisible] = useState(false)
    const [transactionInfo,setTransactionInfo] = useState({
        refNo: "",
        refDate: "",
        label: "",
        phrase: "",
        amount: "",
        status: "",
    })

    const changeFilterDate = (key,val)=>{
        setFilterDate((oldstate) => {
            oldstate[key] = val
            return {
                ...oldstate,
            }
        })
        setFilterType("All")
    }


    const {data,error,loading} = useQuery(GET_CASH_INS, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getCashIns})=> {
            // console.log(getCashIns)
        }
    })

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
                <ActivityIndicator size={24} color={COLOR} />
               </View>
            :  <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{padding: 16}}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={data.getCashIns}
                                keyExtractor={item=>item.logDate}
                                renderItem={({item,index})=>(
                                    <CashInLog 
                                        key={`cashin-log${index}`} 
                                        transactionDate={item.logDate} 
                                        transactionItems={item.logs}  
                                        index={index} 
                                        itemsLength={data.getCashIns.length}
                                        setTransactionInfo={setTransactionInfo}
                                        setTransactionVisible={setTransactionVisible}
                                    />
                                )}
                            />
                        </View>
                        
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
        marginTop: 10,
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

export default ToktokWalletCashInLogs