import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql'
import { GET_TRANSACTIONS } from '../../../../../graphql/toktokwallet'
import {useQuery} from '@apollo/react-hooks'
import {COLOR,FONT,FONT_SIZE} from '../../../../../res/variables'
import {useNavigation} from '@react-navigation/native'
import {Separator, WalletLog} from '../Components'
import { FlatList} from 'react-native-gesture-handler'

const WalletRecentTransactions = ()=> {

    const navigation = useNavigation()
  
    const {data,error,loading} = useQuery(GET_TRANSACTIONS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        variables: {
            input: {
                pageIndex: 0
            }
        },
        onCompleted: ({getTransactions})=> {
            // console.log(JSON.stringify(getTransactions))
        }
    })

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW} />
          </View>
        );
    }

    if(data.getTransactions.recentTransactions.length == 0) {
        return (
            <>
            <View style={{ width: "100%",backgroundColor:"white",padding: 16,}}>
            
                <View style={{flexDirection:"row",marginTop: 0,paddingBottom: 0}}>
                        <View style={{flex: 1,alignItems:"flex-start"}}>
                            <Text style={styles.title}>Recent Transactions</Text>
                        </View>
                </View>
            </View>
            <Separator/>
            <View style={{flex: 1,backgroundColor:"white"}}/>
            </>
        )
    }

    if (error) {
        return <SomethingWentWrong />;
    }


    const ViewTransactions = ()=> {
        return navigation.navigate("ToktokWalletTransactions" , {allTransactions: data.getTransactions.allTransactions})
    }

    return (
        <View style={styles.container}>
            
            <View style={{flexDirection:"row",marginTop: 0,paddingBottom: 0}}>
                    <View style={{flex: 1,alignItems:"flex-start"}}>
                        <Text style={styles.title}>Recent Transactions</Text>
                    </View>
                    <TouchableOpacity onPress={ViewTransactions} style={{flex: 1,alignItems:"flex-end"}}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,color:"#FF8A48"}}>See More</Text>
                    </TouchableOpacity>
            </View>

            <View style={styles.transactions}>
                    <FlatList 
                        nestedScrollEnabled
                        style={{flex: 1,backgroundColor:"white"}}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        data={data.getTransactions.recentTransactions}
                        keyExtractor={item=>item.id}
                        renderItem={({item,index})=>{
                            return <WalletLog key={`recentLog${index}`} item={item} itemsLength={data.getTransactions.recentTransactions} index={index}/>
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
        fontSize: FONT_SIZE.M,
        color: "#212529",
        fontFamily: FONT.BOLD,
    },
    transactions: {
        flex: 1,
        backgroundColor:"white",
    },

})

export default WalletRecentTransactions