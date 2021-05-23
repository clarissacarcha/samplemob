import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import {  COLORS, FONTS, FONT_BOLD, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import { COLOR } from '../../../../../res/variables'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { numberFormat } from '../../../../../helper'
import {GET_OUTGOING_TRANSFER} from '../../../../../graphql/toktokwallet'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useNavigation} from '@react-navigation/native'
import {Separator} from '../Components'

const WalletRecentOutgoingTransfer = ({account})=> {

    const navigation = useNavigation()
    const walletinfo = account.wallet

    const ViewRecentTransfer = (recentTransfer)=> {
        return navigation.navigate("ToktokWalletRecentTransferView",{recentTransfer , walletinfo , account})
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
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>{moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>ViewRecentTransfer(recentTransfer)} style={{flex: 1,alignItems:"flex-end"}}>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color:"#FF8A48"}}>View</Text>
                    </TouchableOpacity>
            </View>
            <View style={styles.divider}/>

            <View style={styles.recent}>
                        <View style={[styles.recentInfo,{justifyContent:"center",alignItems:"flex-start"}]}>
                                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color:"#F6841F",textAlign:"left"}}>{account.wallet.currency.code} {numberFormat(recentTransfer.amount)}</Text>
                        </View>
                        <View style={[{flex: .5,justifyContent:"center",alignItems:"center",}]}>
                                <FIcon5 name="arrow-right" size={18} color="#F6841F"/>
                        </View>
                        <View style={[styles.recentInfo,{alignItems:"flex-end"}]}>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK,textAlign:"right"}}>{destinationFullname}</Text>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color: COLORS.MEDIUM,textAlign:"right"}}>toktokwallet</Text>
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
        fontSize: SIZES.M,
        color: COLORS.DARK,
        fontFamily: FONTS.BOLD,
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