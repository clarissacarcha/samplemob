import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import { COLOR, COLORS, FONTS, FONT_BOLD, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { numberFormat } from '../../../../../helper'
import {GET_RECENT_OUTGOING_TRANSFER} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useNavigation} from '@react-navigation/native'
import {Separator} from '../Components'

const WalletRecentOutgoingTransfer = ({walletinfo})=> {

    const navigation = useNavigation()

    const ViewRecentTransfer = (recentTransfer)=> {
        return navigation.navigate("ToktokWalletRecentTransferView",{recentTransfer , walletinfo})
    }

    const {data,error,loading} = useQuery(GET_RECENT_OUTGOING_TRANSFER, {
        fetchPolicy:"network-only",
        onCompleted: (response)=> {

        }
    })

    if(loading){
        return null
    }

    if(error){
        return null
    }

    if(!data.getRecentOutgoingTransfer){
        return null
    }

    const destination = data.getRecentOutgoingTransfer.destinationInfo
    const recentTransfer = data.getRecentOutgoingTransfer
    const destinationFullname = `${destination.firstName} ${destination.middleName ? destination.middleName + " " : ""}${destination.lastName}`


    return (
        <>
        <View style={styles.container}>
            <Text style={styles.title}>Outgoing Transfer</Text>
            <View style={{flexDirection:"row",marginTop: 10,borderBottomColor:"silver",borderBottomWidth: .2,paddingBottom: 10}}>
                    <View style={{flex: 1,alignItems:"flex-start"}}>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>{moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>ViewRecentTransfer(recentTransfer)} style={{flex: 1,alignItems:"flex-end"}}>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,color:"#FF8A48"}}>View</Text>
                    </TouchableOpacity>
            </View>

            <View style={styles.recent}>
                        <View style={[styles.recentInfo,{justifyContent:"center",alignItems:"flex-start"}]}>
                                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color:"#F6841F"}}>PHP {numberFormat(recentTransfer.amount)}</Text>
                        </View>
                        <View style={[{flex: .5,justifyContent:"center",alignItems:"center",}]}>
                                <FIcon5 name="arrow-right" size={18} color="#F6841F"/>
                        </View>
                        <View style={[styles.recentInfo,{alignItems:"flex-end"}]}>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>{destinationFullname}</Text>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color: COLORS.MEDIUM}}>toktokwallet</Text>
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
})

export default WalletRecentOutgoingTransfer