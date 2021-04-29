import React, {useState,useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native'
import { HeaderBack , HeaderBackClose, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import { COLOR, COLORS, FONTS, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {GET_TOKTOK_WALLET_LOGS} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import moment from 'moment'
import {onError} from '../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import Separator from '../Components/Separator'
import WalletLog from '../Components/WalletLog'
import FilterDateModal from '../Components/FilterDateModal'

export default ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose />,
        headerTitle: ()=> <HeaderTitle label={['Transactions']} />,
    })

    const session = useSelector(state=>state.session)
    const [filtertype, setFilterType] = useState("All")
    const filterOptionsType = ["All","Incoming","Outgoing"]
    const [showFilterDate,setShowFilterDate] = useState(false)
    const [transactions,setTransactions] = useState([])
    const [filteredData,setFilteredData] = useState([])
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

    const changeFilteredData = ()=> {
        let data = []
        if(filtertype === "Incoming"){
            transactions.map((transaction)=>{
                data.push({
                    logDate: transaction.logDate,
                    logs: transaction.logs.filter((log)=> log.destinationUserId == session.user.id)
                })
            })
        }else if(filtertype == "Outgoing"){
            transactions.map((transaction)=>{
                data.push({
                    logDate: transaction.logDate,
                    logs: transaction.logs.filter((log)=> log.sourceUserId == session.user.id)
                })
            })
        }else{
            data = transactions
        }
        setFilteredData(data)
    }

    const [getToktokWalletLogs, {data, error, loading}] = useLazyQuery(GET_TOKTOK_WALLET_LOGS,{
        fetchPolicy: "network-only",
        variables: {
            input: {
                userId: session.user.id,
                startDate: filterDate.from,
                endDate: filterDate.to,
            }
        },
        onError: onError,
        onCompleted: (response)=>{
            setTransactions(response.getToktokWalletLogs)
            setFilteredData(response.getToktokWalletLogs)
        }
    })

    useEffect(()=>{
        getToktokWalletLogs()
    },[filterDate])

    useEffect(()=>{
        changeFilteredData()
    },[filtertype])

    if (error) {
        return <SomethingWentWrong />;
    }
    
    return (
        <>
        <Separator />
        <FilterDateModal 
                    showFilterDate={showFilterDate} 
                    changeFilterDate={changeFilterDate} 
                    filterDate={filterDate} 
                    setShowFilterDate={setShowFilterDate}
            />
            {
                loading
                ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={24} color={COLOR} />
                   </View>
                :  <View style={styles.container}>
                        <View style={{paddingVertical:10,paddingHorizontal:16,}}>
                            <View style={{flexDirection: "row",marginBottom: 8,}}>
                                        <Text style={{fontSize: SIZES.M ,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>Date Range</Text>
                                        <View style={{flex: 1}}>
                                        <TouchableOpacity onPress={()=>setShowFilterDate(true)} style={{alignSelf: "flex-end", padding: 2, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#FCB91A"}}>
                                                    <Text style={{color: "white",fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>{moment(filterDate.from).format('D MMM')} - {moment(filterDate.to).format('D MMM')}</Text>
                                        </TouchableOpacity>
                                        </View>
                            </View>
                            <View style={{flexDirection: "row",margintTop: 15,}}>
                                
                                {
                                    filterOptionsType.map((type)=> (
                                        <TouchableOpacity onPress={()=>setFilterType(type)} style={[styles.filterType, {
                                            borderColor: filtertype === type ? "#FCB91A" : "silver"
                                        }]}>
                                                <Text style={{color: "black",fontSize: SIZES.S,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>{type}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                        <Separator/>
                        <View style={styles.logs}>
                                    <FlatList 
                                        showsVerticalScrollIndicator={false}
                                        data={filteredData}
                                        keyExtractor={(item)=>item.title}
                                        renderItem={({item,index})=>(
                                            <WalletLog key={`log-${index}`} transactionDate={item.logDate} transactionItems={item.logs} index={index} itemsLength={filteredData.length}/>
                                        )}
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