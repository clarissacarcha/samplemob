import React , {useState} from 'react'
import {Text,View,StyleSheet,Modal,Alert,TouchableOpacity} from 'react-native'
import { COLOR, DARK, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, MEDIUM } from '../../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import PincodeModal from '../../Notification/PincodeModal'
import { numberFormat } from '../../../../../../helper';
import SuccessfulModal from './SuccessfulModal'
import {useMutation} from '@apollo/react-hooks'
import {POST_GCASH_ENCASHMENT} from '../../../../../../graphql'
import {onError} from '../../../../../../util/ErrorUtility'

const ConfirmModal = ({showModal,setShowModal, amount , walletinfo , session , navigation})=> {

    const [showpinModal,setShowPinModal] = useState(false)
    const [successModalVisible,setSuccessModalVisible] = useState(false)

    const [postGcashEncashment] = useMutation(POST_GCASH_ENCASHMENT,{
        variables: {
            input: {
                amount: +amount
            }
        },
        onError: onError,
        onCompleted: (response)=>{
            setSuccessModalVisible(true)
        }
    })

    const proceedToEncashment = ()=> {
        if(walletinfo.pincode != null){
            return setShowPinModal(true)
        }

        return postGcashEncashment()
    }

    return (
        <Modal
            animationType="fade"
            visible={showModal}
            transparent={true}
            onRequestClose={() => {
                setShowModal(!showModal);
            }}
        >
            <SuccessfulModal
                successModalVisible={successModalVisible}
                amount={amount}
            />

            <PincodeModal showpinModal={showpinModal} setShowPinModal={setShowPinModal} onConfirm={postGcashEncashment}/> 
            <View style={{flex: 1, backgroundColor: "rgba(0,0,0,0.7)"}}>

             </View>
            <View style={styles.modalContent}>
                    <View style={styles.modalbody}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={()=>setShowModal(!showModal)} style={{position: "absolute",left: 0}}>
                                <FIcon5 name="times" size={20}/>
                            </TouchableOpacity>   
                            <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM}}>Review and confirm</Text>
                        </View>
                        <View style={styles.modalconfirmdetails}>
                            <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver",width: "100%"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Cash out method</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{color: "gray",fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_REGULAR}}>Gcash</Text>
                                </View>  
                            </View>
                            <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver"}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>Cash out amount</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{color: "gray",fontSize: 12,alignSelf: "flex-end",fontFamily: FONT_REGULAR}}>{'\u20B1'} {numberFormat(amount)}</Text>
                                </View>  
                            </View>
                            <View style={{flexDirection: "row",paddingVertical: 12,}}>
                                <View style={{flex: 1}}>    
                                    <Text style={{fontFamily: FONT_MEDIUM}}>Total</Text>
                                </View>
                                <View style={{flex: 1}}>   
                                    <Text style={{fontFamily: FONT_MEDIUM,alignSelf: "flex-end"}}>{'\u20B1'} {numberFormat(amount)}</Text>
                                </View>  
                            </View>

                        </View>
                        <View style={styles.modalconfirmbtn}>
                            <TouchableOpacity onPress={proceedToEncashment} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                                <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>


        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalbody: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        flex: 1,
        paddingHorizontal: 20,
    },
    modalHeader: {
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

export default ConfirmModal