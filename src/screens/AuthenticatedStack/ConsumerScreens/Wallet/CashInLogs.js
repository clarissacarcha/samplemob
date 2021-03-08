import React , {useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,RefreshControl} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import moment from 'moment'
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../res/constants'

const CashInLogs = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In Logs','']}/>,
    })


    const minDate = new Date('1900-01-01');
    const todayDate = new Date();

    const [filterDate,setFilterDate] = useState({
        from: moment(new Date()).subtract(3,'days'),
        to: new Date()
    })

    const CashInLog = ({transactionDate , transactionItems })=> {
        return (
            <View style={styles.transactionLogsContainer}>
                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{transactionDate}</Text>
               {
                   transactionItems.map((item)=>{

                    return (
                        <View style={styles.transaction}>
                            <View style={styles.transactionIcon}>
                              <Image source={require('../../../../assets/icons/walletCashinLog.png')} style={{height: 30, width: 30}} resizeMode="contain"/>
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>Delivery</Text>
                                <Text style={{color: "#909294",fontSize: 10,marginTop: 5,fontFamily: FONT_MEDIUM}}>sf skdlfsdklf sdklfjdklsjflsdjf</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{color: "#FCB91A",fontSize: 12,fontFamily: FONT_MEDIUM}}>+ {'\u20B1'} 650</Text>
                                <Text style={{color: "#909294",fontSize: 10,alignSelf: "flex-end",marginTop: 5,fontFamily: FONT_REGULAR}}>Feb 18</Text>
                            </View>
                        </View>
                    )
                   })
               }
            </View>
        )
    }

    return (
        <View style={styles.container}>
        <View style={styles.content}>
            <View style={{flexDirection: "row"}}>
                <Text style={{fontSize: 16 ,fontWeight: "400"}}></Text>
                <View style={{flex: 1}}>
                   <TouchableOpacity style={{alignSelf: "flex-end", padding: 2, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#FCB91A"}}>
                            <Text style={{color: "white",fontSize: 12,fontFamily: FONT_MEDIUM}}>{moment(filterDate.from).format('D MMM')} - {moment(filterDate.to).format('D MMM')}</Text>
                   </TouchableOpacity>
                </View>
            </View>

            <View style={{marginTop: 10}}>
                <CashInLog transactionDate="Today" transactionItems={[1,2]}></CashInLog>
                <CashInLog transactionDate="Yesterday" transactionItems={[1]}></CashInLog>
                <CashInLog transactionDate="17 Feb 2021" transactionItems={[1,2,3]}></CashInLog>
            </View>

        </View>
   </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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

export default CashInLogs