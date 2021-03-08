import React , {useState} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Dimensions,ScrollView,Image} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { DARK, COLOR, FONT_MEDIUM, FONT_REGULAR } from '../../../../res/constants'

const {height,width} = Dimensions.get("window")



const TransactionLog = ({transactionDate , transactionItems })=> {
    return (
        <View style={styles.transactionLogsContainer}>
            <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{transactionDate}</Text>
           {
               transactionItems.map((item)=>{

                return (
                    <View style={styles.transaction}>
                        <View style={styles.transactionIcon}>
                            <Image source={require('../../../../assets/icons/walletDelivery.png')} style={{height: 30, width: 30}} resizeMode="contain"/>
                        </View>
                        <View style={styles.transactionDetails}>
                            <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>Delivery</Text>
                            <Text style={{color: "#909294",fontSize: 10,marginTop: 5,fontFamily: FONT_MEDIUM}}>sf skdlfsdklf sdklfjdklsjflsdjf</Text>
                        </View>
                        <View style={styles.transactionAmount}>
                            <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>- {'\u20B1'} 60</Text>
                            <Text style={{color: "gray",fontSize: 10,fontFamily: FONT_REGULAR, alignSelf: "flex-end",marginTop: 5}}>Feb 18</Text>
                        </View>
                    </View>
                )
               })
           }
        </View>
    )
}

const TransactionsModal = ({modalVisible,closeModal})=> {

    const [filtertype, setFilterType] = useState("All")

    const filterOptionsType = ["All","Incoming","Outgoing"]
    const minDate = new Date('1900-01-01');
    const todayDate = new Date();
    const [showFilterDate,setShowFilterDate] = useState(false)

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
    }

    const FilterDateModal = ()=> {
    return (
        <Modal
           visible={showFilterDate}
           animationType="fade"
           transparent={true}
           onRequestClose={()=>setShowFilterDate(false)}
          >

              <View style={{flex: 1 ,justifyContent: "center",alignItems: "center"}}> 
                  <View style={{width: width * 0.8 , height: height * 0.8 , backgroundColor: "white",padding: 10,borderRadius: 20,  shadowColor: '#000',
                                justifyContent: "center",
                                alignItems: "center",
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,}}
                    >
                        <Text style={{fontWeight: "400",fontSize: 20}}>From</Text>
                        <DatePicker date={new Date(filterDate.from)} mode="date" maximumDate={todayDate} minimumDate={minDate} />
                        <Text style={{fontWeight: "400",fontSize: 20,marginTop: 20}}>To</Text>
                        <DatePicker date={filterDate.to} onDateChange={(date)=>console.log(date)} mode="date" maximumDate={todayDate} minimumDate={minDate} />

                        <TouchableOpacity onPress={()=>setShowFilterDate(false)} style={{marginTop: 10, padding: 20,backgroundColor: DARK, width: "90%",borderRadius: 10, alignItems: "center"}}>
                            <Text style={{color: COLOR}}>Ok</Text>
                        </TouchableOpacity>
                  </View>
              </View>

          </Modal>
        )
    }


    return (
       <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={closeModal}
       >

           <FilterDateModal/>

           <View style={styles.container}>
                <TouchableOpacity onPress={closeModal} style={styles.header}>
                        <FIcon5 name="caret-down" size={20} />
                </TouchableOpacity>
                <View style={styles.content}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{fontSize: 14 ,fontFamily: FONT_MEDIUM}}>Transactions</Text>
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
                                        <Text style={{color: "black",fontSize: 11,fontFamily: FONT_REGULAR}}>{type}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={{marginTop: 10}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TransactionLog transactionDate="Today" transactionItems={[1,2]}></TransactionLog>
                            <TransactionLog transactionDate="Yesterday" transactionItems={[1]}></TransactionLog>
                            <TransactionLog transactionDate="17 Feb 2021" transactionItems={[1]}></TransactionLog>
                        </ScrollView>
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
        padding: 20,
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
    transactionLogsContainer: {
        marginVertical: 5
    },
    transaction: {
        padding: 10,
        paddingVertical: 15,
        borderWidth: 0.5 ,
        borderColor:"silver",
        marginVertical: 10,
        borderRadius: 5,
        flexDirection: "row"
    },
    transactionIcon: {
        flexBasis: 50,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    }
})

export default TransactionsModal