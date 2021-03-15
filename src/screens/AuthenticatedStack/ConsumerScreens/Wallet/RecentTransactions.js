import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native'
import {SomethingWentWrong} from '../../../../components'
import {GET_TOKTOK_WALLET_RECENT_TRANSACTIONS} from '../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import { COLOR, FONT_MEDIUM, FONT_REGULAR } from '../../../../res/constants'
import { numberFormat } from '../../../../helper'
import moment from 'moment'

const RecentTransactions = ({seeAll,walletId})=> {


    const {data, error ,loading } = useQuery(GET_TOKTOK_WALLET_RECENT_TRANSACTIONS, {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                toktokWalletId: walletId
            }
        },
        onCompleted: ({getWalletRecentTransactions})=>{

        },
        onError: (err)=>{
            console.log(err)
        }
    })

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    const TransactionLog = ({transactionDate , transactionItems })=> {

      const dateValue = moment(transactionDate).tz("Asia/Manila").format("YYYY-MM-DD");
      const phTodayDate = moment().tz("Asia/Manila").format("YYYY-MM-DD");
      const phYesterdayDate = moment().subtract(1,"days").tz("Asia/Manila").format("YYYY-MM-DD");
      let datedisplay = ''
      if(dateValue == phTodayDate){
        datedisplay = "Today"
      }else if(dateValue == phYesterdayDate){
          datedisplay = "Yesterday"
      }else{
          datedisplay = moment(transactionDate).tz("Asia/Manila").format('DD MMM YYYY');
      }

        return (
            <View style={styles.transactionLogsContainer}>
                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{datedisplay}</Text>
               {
                   transactionItems.map((item)=>{

                    let amount = item.incoming > 0 ? item.incoming : item.outgoing
                    let color = item.incoming > 0 ? "green" : "red"
                    let sign = item.incoming > 0 ? "+" : "-"

                    return (
                        <View style={styles.transaction}>
                            <View style={styles.transactionIcon}>
                                <Image source={require('../../../../assets/icons/walletCashin.png')} style={{height: 30, width: 30}} resizeMode="contain"/>
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>{item.type}</Text>
                                <Text style={{color: "#909294",fontSize: 10,marginTop: 5,fontFamily: FONT_MEDIUM}}>Cash in from Paypanda</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM ,color}}>{sign} {'\u20B1'} {numberFormat(amount)}</Text>
                                <Text style={{color: "gray",fontSize: 10,alignSelf: "flex-end",marginTop: 5,fontFamily: FONT_REGULAR}}>{moment(transactionDate).tz('Asia/Manila').format('MMM DD')}</Text>
                            </View>
                        </View>
                    )
                   })
               }
            </View>
        )
    }

    return (
        <View style={styles.recentTransactions}>
            <View style={styles.recentTransactionsTitle}>
                <Text style={{fontSize: 14,color: "#212529",fontFamily: FONT_MEDIUM}}>Recent Transactions</Text>
                <TouchableOpacity onPress={seeAll} style={styles.transactionSeeAllbtn}>
                    <Text style={{fontSize: 12 ,color: "#F6841F",fontFamily: FONT_MEDIUM}}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.recentLogs}>

                {
                    data.getWalletRecentTransactions.map((item)=> (
                        <TransactionLog transactionDate={item.title} transactionItems={item.logs}></TransactionLog>
                    ))
                }
                   
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    recentTransactions: {
        flex: 1,
        marginTop: 20,
    },
    recentTransactionsTitle: {
        flexDirection: "row",
        marginBottom: 10,
    },
    transactionSeeAllbtn: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    recentLogs: {
        flex: 1,
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
        // backgroundColor: "red"
    },
    transactionDetails: {
        flex: 1,
        // backgroundColor: "blue"
    },
    transactionAmount: {
        flexBasis: "auto",
        // backgroundColor: "green",
        alignItems: "flex-end"
    }
})

export default RecentTransactions