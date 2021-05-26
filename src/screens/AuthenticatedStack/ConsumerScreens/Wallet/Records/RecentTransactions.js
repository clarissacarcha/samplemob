import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import {GET_TOKTOK_WALLET_RECENT_LOGS} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import { COLOR, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import WalletLog from './WalletLog'

const RecentTransactions = ({seeAll,walletId,session})=> {


    const {data, error ,loading } = useQuery(GET_TOKTOK_WALLET_RECENT_LOGS, {
        fetchPolicy: 'network-only',
        // fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                userId: session.user.id
            }
        },
        onCompleted: ({getToktokWalletRecentLogs})=>{
            // console.log(JSON.stringify(getToktokWalletRecentLogs))
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

    const TransactionsData = ()=> {
        return (
            <>
            <View style={styles.recentTransactionsTitle}>
                <Text style={{fontSize: SIZES.M,color: "#212529",fontFamily: FONT_MEDIUM}}>Recent Transactions</Text>
                <TouchableOpacity onPress={seeAll} style={styles.transactionSeeAllbtn}>
                    <Text style={{fontSize: SIZES.M ,color: "#F6841F",fontFamily: FONT_MEDIUM}}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.recentLogs}>

                {
                    data.getToktokWalletRecentLogs.map((item,index)=> (
                        <WalletLog key={`recentLog${index}`} transactionDate={item.logDate} transactionItems={item.logs} index={index}/>
                    ))
                }
                   
            </View>
            </>
        )
    }

    return (
        <View style={styles.recentTransactions}>
                {
                    data.getToktokWalletRecentLogs.length > 0
                    ? <TransactionsData />
                    : null
                }
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