import React, {useState,useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native'
import { COLOR , FONT , FONT_SIZE} from '../../../../../res/variables'
import moment from 'moment'
import {onError} from '../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import {Separator,WalletLog,FilterDateModal} from '../Components'
import { HeaderBack , HeaderTitle } from '../../../../../revamp'

const ToktokWalletTransactions = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Transactions']} />,
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const allTransactions = route.params.allTransactions

    return (
        <>
        <Separator />
        <View style={styles.container}>        
                <View style={styles.logs}>
                            <FlatList 
                                showsVerticalScrollIndicator={false}
                                data={allTransactions}
                                keyExtractor={(item)=>item.title}
                                renderItem={({item,index})=>(
                                    <WalletLog account={tokwaAccount} key={`recentLog${index}`} transactionDate={item.logDate} transactionItems={item.logs} index={index}/>
                                )}
                            />
                </View>
        </View>
            
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

export default ToktokWalletTransactions