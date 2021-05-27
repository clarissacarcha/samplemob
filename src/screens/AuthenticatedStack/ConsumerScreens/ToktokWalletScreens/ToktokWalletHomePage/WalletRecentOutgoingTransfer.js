import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import { COLOR , FONT , FONT_SIZE  } from '../../../../../res/variables'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { numberFormat } from '../../../../../helper'
import {GET_OUTGOING_TRANSFER} from '../../../../../graphql/toktokwallet'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useNavigation} from '@react-navigation/native'
import {Separator} from '../Components'
import {useSelector} from 'react-redux'

const WalletRecentOutgoingTransfer = ()=> {

    const navigation = useNavigation()
    const tokwaAccount = useSelector(state=>state.toktokWallet)


    const ViewRecentTransfer = (recentTransfer)=> {
        return navigation.navigate("ToktokWalletRecentTransferView",{recentTransfer})
    }

    const {data,error,loading} = useQuery(GET_OUTGOING_TRANSFER, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getOutgoingTransfer})=> {
            console.log(JSON.stringify(getOutgoingTransfer))
        }
    })

    if(loading){
        return null
    }

    if(error){
        return null
    }

    if(!data.getOutgoingTransfer){
        return null
    }
    
    const destination = data.getOutgoingTransfer.destinationPerson
    const recentTransfer = data.getOutgoingTransfer
    const destinationFullname = `${destination.firstName} ${destination.middleName ? destination.middleName + " " : ""}${destination.lastName}`

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.title}>Outgoing Transfer</Text>

            <View style={{flexDirection:"row",marginTop: 10,paddingBottom: 10}}>
                    <View style={{flex: 1,alignItems:"flex-start"}}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>{moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>ViewRecentTransfer(recentTransfer)} style={{flex: 1,alignItems:"flex-end"}}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,color:"#FF8A48"}}>View</Text>
                    </TouchableOpacity>
            </View>
            <View style={styles.divider}/>

            <View style={styles.recent}>
                        <View style={[styles.recentInfo,{justifyContent:"center",alignItems:"flex-start"}]}>
                                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color:"#F6841F",textAlign:"left"}}>{tokwaAccount.wallet.currency.code} {numberFormat(recentTransfer.amount)}</Text>
                        </View>
                        <View style={[{flex: .5,justifyContent:"center",alignItems:"center",}]}>
                                <FIcon5 name="arrow-right" size={18} color="#F6841F"/>
                        </View>
                        <View style={[styles.recentInfo,{alignItems:"flex-end"}]}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"right"}}>{destinationFullname}</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color: COLOR.DARK,textAlign:"right"}}>toktokwallet</Text>
                        </View>
            </View> 

        </View>
        <Separator />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor:"white",
        padding: 16,
    },
    title: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD,
        fontWeight:"bold"
    },
    recent: {
        flexDirection:"row",
        borderColor:"silver",
        marginTop: 10,
    },
    recentInfo: {
        flex: 1,
        // padding: 5,
    },
    divider: {
        height: 2,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

export default WalletRecentOutgoingTransfer