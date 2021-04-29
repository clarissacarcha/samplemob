import React , {useState,useContext,useRef} from 'react'
import {View,Text,StyleSheet,Modal,TouchableOpacity,TouchableHighlight,Alert} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR , DARK , COLOR, SIZES } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../helper'
import moment from 'moment'
import {CheckWalletRestrictionContext} from './CheckWalletRestrictionProvider'
import {GET_RECENT_OUTGOING_TRANSFER} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'

const RecentOutgoingTransfer = ({walletinfo , onPress , ProceedTransfer})=> {

    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)


    const proceedTransaction = ()=> {
        if(!checkIfResctricted()){
            onPress(recentTransfer)
        }
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
        {
            data.getRecentOutgoingTransfer &&  
            <View style={styles.container}>
                <Text style={{fontSize: 14,color: "#212529",fontFamily: FONT_MEDIUM}}>Recent Outgoing Transfer</Text>

                <TouchableOpacity onPress={proceedTransaction} style={styles.recent}>
                        <View style={[styles.recentInfo,{backgroundColor:"white",justifyContent:"center",alignItems:"flex-start"}]}>
                                <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.L,color:"#F6841F"}}>PHP {numberFormat(recentTransfer.amount)}</Text>
                        </View>
                        <View style={[{flex: .5,justifyContent:"center",alignItems:"center",}]}>
                                <FIcon5 name="arrow-right" size={18} color="#F6841F"/>
                        </View>
                        <View style={[styles.recentInfo,{backgroundColor:"white",alignItems:"flex-end"}]}>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>{destinationFullname}</Text>
                            <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.XS}}>{moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
                        </View>
                </TouchableOpacity>

             </View> 
        }

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    recent: {
        flexDirection:"row",
        padding: 5,
        borderRadius: 5,
        borderWidth: .5,
        borderColor:"silver",
        marginTop: 10,
    },
    recentInfo: {
        flex: 1,
        padding: 5,
    },
    confirmModalContent: {
        flex: 1,
        backgroundColor:"rgba(0,0,0,0.7)"
    },
    confirmModalBody: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        flex: 1,
        paddingHorizontal: 20,
    },
    confirmModalHeader: {
        height: 50,
        position: "relative",
        justifyContent: "center",
        alignItems: "center"
    },
    modalconfirmdetails: {
        flex: 1,
    },
    modalconfirmbtn: {
        height: 60,
        width: "100%",
        paddingVertical: 10,
        marginBottom: 20,
    },
})

export default RecentOutgoingTransfer