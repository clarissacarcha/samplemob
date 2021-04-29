import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator , FlatList} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import moment from 'moment'
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../../res/constants'
import FilterDateModal from '../../Components/FilterDateModal'
import {useLazyQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_LOGS} from '../../../../../../graphql'
import {onError} from '../../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../../helper'
import Separator from '../../Components/Separator'


const CashInLog = ({transactionDate , transactionItems , index , itemsLength })=> {

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

    return (
        <View style={[styles.transactionLogsContainer, {marginBottom: index == itemsLength - 1 ? 100 : 0}]}>
            <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>{datedisplay}</Text>
           {
               transactionItems.map((item)=>{

                let status
                switch (item.trails[0].status) {
                    case 0:
                        status = "Initialized"
                        break;
                    case 1:
                        status = "Pending"
                        break
                    case 2:
                        status = "Successful"
                        break
                    default:
                        status = "Rejected"
                        break;
                }

                return (
                    <>
                    {
                        // item.trails[0].status != 0 &&
                        <View style={styles.transaction}>
                            {/* <View style={styles.transactionIcon}>
                            <Image source={require('../../../../../assets/icons/walletLogCashin.png')} style={{height: 35, width: 35}} resizeMode="contain"/>
                            </View> */}
                            <View style={styles.transactionDetails}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>Ref # {item.referenceNumber}</Text>
                                <Text style={{color: "#909294",fontSize: SIZES.M,marginTop: 0,fontFamily: FONTS.REGULAR}}>{status}</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{color: "#FCB91A",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>PHP {numberFormat(item.amount)}</Text>
                                <Text style={{color: "#909294",fontSize: SIZES.M,alignSelf: "flex-end",marginTop: 0,fontFamily: FONTS.REGULAR}}>{moment(item.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
                            </View>
                        </View>
                    }
                
                    </>
                )
               })
           }
        </View>
    )
}

export default ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Cash In Logs','']}/>,
    })

    const session = useSelector(state=>state.session)

    const [filtertype, setFilterType] = useState("All")
    const filterOptionsType = ["All","Pending","Confirmed","Rejected"]
    const [showFilterDate,setShowFilterDate] = useState(false)
    const [logs,setLogs] = useState([])
    const [filteredLogs,setFilteredLogs] = useState([])
    const [filterDate,setFilterDate] = useState({
        from: moment(new Date()).subtract(3,'days'),
        to: new Date()
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

    const [getCashInLogs , {data,error,loading}] = useLazyQuery(GET_CASH_IN_LOGS,{
        fetchPolicy: "network-only",
        variables: {
            input: {
                tokUserId: session.user.id,
                startDate: filterDate.from,
                endDate: filterDate.to,
            }
        },
        onError: onError,
        onCompleted: (response)=> {
            setLogs(response.getCashInLogs)
            setFilteredLogs(response.getCashInLogs)
        }
    })

    useEffect(()=>{
        getCashInLogs()
    },[filterDate])


    return (
        <>
        <FilterDateModal 
                showFilterDate={showFilterDate} 
                changeFilterDate={changeFilterDate} 
                filterDate={filterDate} 
                setShowFilterDate={setShowFilterDate}
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
                            <View style={{flexDirection: "row",paddingBottom: 10,}}>
                                <Text style={{fontSize: SIZES.M ,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>Date Range</Text>
                                <View style={{flex: 1}}>
                                <TouchableOpacity onPress={()=>setShowFilterDate(true)} style={{alignSelf: "flex-end", padding: 2, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#FCB91A"}}>
                                            <Text style={{color: "white",fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>{moment(filterDate.from).format('D MMM')} - {moment(filterDate.to).format('D MMM')}</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Separator />
                        <View style={{padding: 16,}}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredLogs}
                                keyExtractor={item=>item.title}
                                renderItem={({item,index})=>(
                                    <CashInLog key={`cashin-log${index}`} transactionDate={item.logDate} transactionItems={item.logs}  index={index} itemsLength={filteredLogs.length}/>
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
