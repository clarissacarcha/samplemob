import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'


const RecentTransactions = ({seeAll})=> {



    const TransactionLog = ({transactionDate , transactionItems })=> {
        return (
            <View style={styles.transactionLogsContainer}>
                <Text>{transactionDate}</Text>
               {
                   transactionItems.map((item)=>{

                    return (
                        <View style={styles.transaction}>
                            <View style={styles.transactionIcon}>
        
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text>Delivery</Text>
                                <Text style={{color: "gray",fontSize: 12,marginTop: 5}}>sf skdlfsdklf sdklfjdklsjflsdjf</Text>
                            </View>
                            <View style={styles.transactionAmount}>
                                <Text>- {'\u20B1'} 60</Text>
                                <Text style={{color: "gray",fontSize: 12,alignSelf: "flex-end",marginTop: 5}}>Feb 18</Text>
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
                <Text style={{fontSize: 16,color: "#212529",fontWeight: "500"}}>Recent Transactions</Text>
                <TouchableOpacity onPress={seeAll} style={styles.transactionSeeAllbtn}>
                    <Text style={{fontSize: 14 ,color: "#F6841F"}}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.recentLogs}>
                    <TransactionLog transactionDate="Today" transactionItems={[1,2]}></TransactionLog>
                    <TransactionLog transactionDate="Yesterday" transactionItems={[1]}></TransactionLog>
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