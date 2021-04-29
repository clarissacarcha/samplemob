import React , {useEffect, useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,FlatList} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {GET_TOKTOK_WALLET_LOGS} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'
import WalletLog from './WalletLog'
import FilterDateModal from '../Components/FilterDateModal'

const WalletTransactionsModal = ({modalVisible,closeModal,session})=> {

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

    return (
       <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={closeModal}
       >

           <FilterDateModal 
                    showFilterDate={showFilterDate} 
                    changeFilterDate={changeFilterDate} 
                    filterDate={filterDate} 
                    setShowFilterDate={setShowFilterDate}
            />

           <View style={styles.container}>
                <TouchableOpacity onPress={closeModal} style={styles.header}>
                        <FIcon5 name="caret-down" size={20} />
                </TouchableOpacity>
                <View style={styles.content}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{fontSize: SIZES.M ,fontFamily: FONT_MEDIUM}}>Transactions</Text>
                        <View style={{flex: 1}}>
                           <TouchableOpacity onPress={()=>setShowFilterDate(true)} style={{alignSelf: "flex-end", padding: 2, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#FCB91A"}}>
                                    <Text style={{color: "white",fontSize: 12,fontFamily: FONT_MEDIUM}}>{moment(filterDate.from).format('D MMM')} - {moment(filterDate.to).format('D MMM')}</Text>
                           </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flexDirection: "row",marginTop: 10}}>
                
                        {
                            filterOptionsType.map((type)=> (
                                <TouchableOpacity onPress={()=>setFilterType(type)} style={[styles.filterType, {
                                    borderColor: filtertype === type ? "#FCB91A" : "silver"
                                }]}>
                                        <Text style={{color: "black",fontSize: SIZES.S,fontFamily: FONT_REGULAR}}>{type}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={{marginTop: 10 , paddingBottom: 20}}>
                        {/* <ScrollView showsVerticalScrollIndicator={false}>
                                                    <Text>{JSON.stringify(filteredData)}</Text>
                        </ScrollView> */}
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
           </View>

        
       </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        padding: 10,
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
        padding: 2, 
        paddingHorizontal: 15, 
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 10
    },
})

export default WalletTransactionsModal