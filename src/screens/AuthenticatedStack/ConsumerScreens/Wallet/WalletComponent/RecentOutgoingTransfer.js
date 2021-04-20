import React , {useState,useContext} from 'react'
import {View,Text,StyleSheet,Modal,TouchableOpacity,TouchableHighlight,Alert} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR , DARK , COLOR } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../helper'
import moment from 'moment'
import {CheckWalletRestrictionContext} from './Context/CheckWalletRestrictionProvider'
import {GET_RECENT_OUTGOING_TRANSFER} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useNavigation} from '@react-navigation/native'


const ConfirmModal = ({isVisible,setIsvisible, recipient, onPress , transactionInfo}) => {

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={()=>setIsvisible(false)}
        >

            <View style={styles.confirmModalContent}>
                    <TouchableHighlight underlayColor onPress={()=>setIsvisible(false)} style={{flex: 1}}>
                            <View>

                            </View>
                    </TouchableHighlight>

                    <View style={styles.confirmModalBody}>
                        <View style={styles.confirmModalHeader}>
                            <TouchableOpacity onPress={()=>setIsvisible(false)} style={{position: "absolute",left: 0,paddingVertical: 10}}>
                                <FIcon5 name="times" size={20}/>
                            </TouchableOpacity>   
                            <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM}}>Do fund transfer again?</Text>
                        </View>
                        <View style={styles.modalconfirmdetails}>
                            <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver",width: "100%"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Payment Method</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_MEDIUM}}>toktok Wallet</Text>
                                </View>  
                            </View>
                            <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Recipient</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_MEDIUM}}>{recipient}</Text>
                                </View>  
                            </View>

                            {/* <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Mobile No</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_MEDIUM}}>{transactionInfo.destinationInfo.username}</Text>
                                </View>  
                            </View> */}

                            <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Fund Transfered</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_MEDIUM}}> {'\u20b1'} {numberFormat(transactionInfo.amount)}</Text>
                                </View>  
                            </View>
                        </View>

                        <View style={styles.modalconfirmbtn}>
                            <TouchableOpacity onPress={onPress} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                                <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>               

            </View>

        </Modal>
    )
}

const RecentOutgoingTransfer = ({walletinfo})=> {


    const navigation = useNavigation()
    const [confirmModalVisible,setConfirmModalVisible] = useState(false)
    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)

    const proceedTransaction = ()=> {
        if(!checkIfResctricted()){
            return setConfirmModalVisible(true)
        }
    }

    const onPress = (recentTransfer)=> {
        setConfirmModalVisible(false)
        return navigation.navigate("TokTokWalletSendMoney", {walletinfo , recentTransfer})
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
        <ConfirmModal 
                isVisible={confirmModalVisible} 
                setIsvisible={setConfirmModalVisible} 
                recipient={destinationFullname} 
                transactionInfo={recentTransfer} 
                onPress={()=>onPress(recentTransfer)}
        />
        {
            data.getRecentOutgoingTransfer &&  
            <View style={styles.container}>
                <Text style={{fontSize: 14,color: "#212529",fontFamily: FONT_MEDIUM}}>Recent Outgoing Transfer</Text>

                <TouchableOpacity onPress={proceedTransaction} style={styles.recent}>
                        <View style={[styles.recentInfo,{backgroundColor:"white",justifyContent:"center",alignItems:"flex-start"}]}>
                                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16,color:"#F6841F"}}>{'\u20b1'} {numberFormat(recentTransfer.amount)}</Text>
                        </View>
                        <View style={[{flex: .5,justifyContent:"center",alignItems:"center",}]}>
                                <FIcon5 name="arrow-right" size={18} color="#F6841F"/>
                        </View>
                        <View style={[styles.recentInfo,{backgroundColor:"white",alignItems:"flex-end"}]}>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 12}}>{destinationFullname}</Text>
                            <Text style={{fontFamily: FONT_LIGHT,fontSize: 10}}>{moment(recentTransfer.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
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