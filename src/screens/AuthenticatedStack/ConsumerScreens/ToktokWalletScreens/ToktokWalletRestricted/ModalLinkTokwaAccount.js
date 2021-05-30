import React, {useState} from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,TextInput} from 'react-native'
import { SIZE ,FONT , FONT_SIZE , COLOR} from '../../../../../res/variables'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_CHECK_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../hooks'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const {height,width} = Dimensions.get("window")

const ModalLinkTokwaAccount = ({visible,setVisible})=> {

    const [mobileNo,setMobileNo] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert()
    const navigation = useNavigation()
    const session = useSelector(state=>state.session)

    const [getCheckAccount, {data ,error ,loading}] = useLazyQuery(GET_CHECK_ACCOUNT, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getCheckAccount})=> {
            console.log(getCheckAccount)
            setVisible(false)
            setMobileNo("")
            setErrorMessage("")
            navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: getCheckAccount})
        },
        onError: (error)=> {
            // onErrorAlert({alert,error})
            if(error.graphQLErrors.length > 0){
                error.graphQLErrors.map((err)=> {
                    setErrorMessage("Account doesn't exist")
                })
                return
            }

            onErrorAlert({alert,error})

        }
    })

    const changeMobileNo = (value)=> {
        const mobile = value.replace(/[^0-9]/g,"")

        if(mobile.length == 0){
             setErrorMessage("")
             setMobileNo(mobile)
             return
        }

        if(mobile.length > 10 && mobile.slice(0,2) == "09"){
            setErrorMessage("")
        }else{
            setErrorMessage("Mobile number must be valid.")
        }

        if(mobile.length > 11) return
    
        if(value[0] == "9"){
            setMobileNo("09")
        }else{
            setMobileNo(mobile)
        }
       
    }

    const openLinkPage = ()=>{
        getCheckAccount({
            variables:{
                input: {
                    mobileNumber: mobileNo,
                    motherReferenceNumber: session.user.id,
                }
            }
        })
    }

    const closeModal = ()=> {
        setVisible(false)
        setMobileNo("")
        setErrorMessage("")
    }

    return (
        <>
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
            style={styles.container}
        >
            <View style={styles.modalBody}>
                    <View style={styles.content}>
                        <View style={{flex:1,}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L, textAlign:"left",marginBottom: 15}}>Link your toktokwallet account</Text>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Mobile number</Text>
                            <TextInput 
                                 style={styles.input} 
                                 placeholder="Enter your toktokwallet mobile number"
                                 keyboardType="number-pad"
                                 placeholderTextColor={COLOR.DARK}
                                 value={mobileNo}
                                 onChangeText={changeMobileNo}
                            />
                            <Text style={{fontFamily: FONT.REGULAR,color:"red",fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
                        </View>
                        <View style={{height: SIZE.FORM_HEIGHT,justifyContent:"flex-end",flexDirection:"row"}}>
                                <TouchableOpacity 
                                        style={{
                                            flex: 1,
                                            paddingVertical: 2,
                                            height: SIZE.FORM_HEIGHT,
                                            justifyContent:"center",
                                            alignItems:"center",
                                            // backgroundColor:"lightgray"
                                        }}
                                        onPress={closeModal}
                                    >
                                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                        style={{
                                            flex: 1,
                                            paddingVertical: 2,
                                            height: SIZE.FORM_HEIGHT,
                                            justifyContent:"center",
                                            alignItems:"center",
                                        }}
                                        disabled={mobileNo.length == 0 || errorMessage != ""}
                                        onPress={openLinkPage}
                                    >
                                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.ORANGE , opacity: mobileNo.length == 0 || errorMessage != "" ? 0.5: 1 }}>Link Account</Text>
                                </TouchableOpacity>
                    </View>
                    </View>
            </View>
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex: 1,
        backgroundColor:"rgba(34, 34, 34, 0.5)",
        justifyContent:"center",
        alignItems:"center"
    },
    content: {
        backgroundColor:"white",
        width: width * 0.9,
        height: 220,
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    }
})

export default ModalLinkTokwaAccount