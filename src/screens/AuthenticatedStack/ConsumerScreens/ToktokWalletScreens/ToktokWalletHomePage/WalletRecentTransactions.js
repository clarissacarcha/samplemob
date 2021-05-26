import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator,FlatList} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import {GET_TOKTOK_WALLET_RECENT_LOGS} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import { COLOR, FONTS, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'
import WalletLog from '../Components/WalletLog'

const WalletRecentTransactions = ({session})=> {

    const navigation = useNavigation()

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

    const ViewTransactions = ()=> {
        return navigation.navigate("ToktokWalletTransactions")
    }


    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if(data.getToktokWalletRecentLogs.length == 0) {
        return (
            <View style={{flex:1,backgroundColor:"white"}}/>
        )
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    return (
        <View style={styles.container}>
            
            <View style={{flexDirection:"row",marginTop: 0,paddingBottom: 0}}>
                    <View style={{flex: 1,alignItems:"flex-start"}}>
                        <Text style={styles.title}>Recent Transactions</Text>
                    </View>
                    <TouchableOpacity onPress={ViewTransactions} style={{flex: 1,alignItems:"flex-end"}}>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color:"#FF8A48"}}>See All</Text>
                    </TouchableOpacity>
            </View>

            <View style={styles.transactions}>
                    <FlatList 
                        style={{flex: 1,backgroundColor:"white"}}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        data={data.getToktokWalletRecentLogs}
                        keyExtractor={item=>item.logDate}
                        renderItem={({item,index})=>{
                            return <WalletLog key={`recentLog${index}`} transactionDate={item.logDate} transactionItems={item.logs} index={index}/>
                        }}
                    />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor:"white",
        padding: 16,
        flex: 1,
    },
    title: {
        fontSize: SIZES.M,
        color: "#212529",
        fontFamily: FONTS.BOLD,
    },
    transactions: {
        flex: 1,
        backgroundColor:"white",
    },

})

export default WalletRecentTransactions