import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import {GET_WALLET_RECENT_TRANSACTIONS} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import { COLOR, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'
import WalletLog from './WalletLog'

const RecentTransactions = ({seeAll,walletId,session})=> {


    const {data, error ,loading } = useQuery(GET_WALLET_RECENT_TRANSACTIONS, {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                userId: session.user.id
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
                    data.getWalletRecentTransactions.map((item,index)=> (
                        <WalletLog key={`recentLog${index}`} transactionDate={item.logDate} transactionItems={item.logs} index={index}/>
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