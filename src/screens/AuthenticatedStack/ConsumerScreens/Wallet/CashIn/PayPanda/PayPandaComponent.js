import React, {useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,TextInput,Platform,KeyboardAvoidingView,ActivityIndicator,Alert,Dimensions} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import {useMutation} from '@apollo/react-hooks'
import {INITIALIZE_WALLET_CASHIN_DATA} from '../../../../../../graphql/model'
import {onError} from '../../../../../../util/ErrorUtility';
import {numberFormat} from '../../../../../../helper'

const {height,width} = Dimensions.get("window")

const PayPandaComponent = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack icon="x"/>,
        headerTitle: ()=> <HeaderTitle label={['Enter Amount','']}/>,
    })


    const walletId = route.params.walletId
    const balance = route.params.balance
    const userstate = useSelector(state=>state.session.user)
    const [showModal,setShowModal] = useState(false)
    const [amount,setAmount] = useState("")

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9]/g, '')
        setAmount(num.substring(0,1) == 0 ? num.slice(1) : num)
    }

    const [initializeWalletCashinData , {data,error,loading}] = useMutation(INITIALIZE_WALLET_CASHIN_DATA, {
        // fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: ({initializeWalletCashinData})=> {
            
            navigation.navigate("TokTokWalletCashINPaypandaWebView", {
                ...initializeWalletCashinData,
                email_address: userstate.person.emailAddress,
                payer_name: `${userstate.person.firstName}${userstate.person.middleName ? " " + userstate.person.middleName : ""} ${userstate.person.lastName}`,
                mobile_number: userstate.username,
                amount_to_pay: amount,
                currency: "PHP",
                walletId: walletId
            })
        }
    })

    const proceedToPaypandaPortal = ()=> {
        initializeWalletCashinData({
            variables: {
                input: {
                    amount: +amount,
                    userId: userstate.id
                }
            }
        })
        setShowModal(false)
        // Alert.alert("test")
       
    }

    const ConfirmModal = ()=> (
        <Modal
            animationType="fade"
            visible={showModal}
            transparent={true}
            onRequestClose={() => {
                setShowModal(!showModal);
            }}
        >
              <View style={{flex: 1, backgroundColor: "rgba(0,0,0,0.7)"}}>

              </View>
              <View style={styles.modalContent}>
                 <View style={styles.modalbody}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={()=>setShowModal(!showModal)} style={{position: "absolute",left: 0}}>
                            <FIcon5 name="times" size={20}/>
                        </TouchableOpacity>   
                        <Text style={{fontSize: 14,fontWeight:"bold"}}>Review and confirm</Text>
                    </View>
                    <View style={styles.modalconfirmdetails}>
                        <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver",width: "100%"}}>
                            <View style={{flex: 1}}>    
                                <Text style={{color: "gray",fontSize: 12}}>Payment Method</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                 <Text style={{color: "gray",fontSize: 12,alignSelf: "flex-end"}}>PayPanda</Text>
                            </View>  
                        </View>
                        <View style={{flexDirection: "row",paddingVertical: 12,borderBottomWidth: 0.5,borderColor: "silver"}}>
                            <View style={{flex: 1}}>    
                                <Text style={{color: "gray",fontSize: 12}}>Cash-in amount</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                 <Text style={{color: "gray",fontSize: 12,alignSelf: "flex-end"}}>{'\u20B1'} {numberFormat(amount)}</Text>
                            </View>  
                        </View>
                        <View style={{flexDirection: "row",paddingVertical: 12,}}>
                            <View style={{flex: 1}}>    
                                <Text style={{fontWeight:"bold"}}>Total</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                <Text style={{fontWeight:"bold",alignSelf: "flex-end"}}>{'\u20B1'} {numberFormat(amount)}</Text>
                            </View>  
                        </View>

                    </View>
                    <View style={styles.modalconfirmbtn}>
                        <TouchableOpacity onPress={()=>proceedToPaypandaPortal()} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                            <Text style={{color: COLOR,fontSize: 12}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>
            
        </Modal>
    )

    const confirmAmount = ()=> {
        amount === "" ? Alert.alert("Enter Amount") : setShowModal(true)
    }


    return (
      <>
       <ConfirmModal/>
       <View style={styles.container}>
            <View style={styles.paypandaLogo}>
                <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/images/paypanda.png')}/>
                <Text style={{alignSelf: "center",marginLeft: 15,fontSize: 14,fontWeight:"bold"}}>PayPanda</Text>
            </View>
            {
                !loading
                ? <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.amountcontent}>
                        
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 50}}>{'\u20B1'}</Text>
                            <TextInput 
                                    value={amount}
                                    onChangeText={value=>changeAmount(value)}
                                    keyboardType="numeric"
                                    style={styles.input}
                                    placeholder="0.00"
                                    onSubmitEditing={confirmAmount}
                                />
                        </View>
                        <Text style={{color:"gray",fontSize: 14}}>Current Balance {'\u20B1'} {numberFormat(balance)}</Text>
                 </KeyboardAvoidingView>
                : <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}><ActivityIndicator size={50}/></View>
                
            }

            <View style={styles.cashinbutton}>
                    <TouchableOpacity onPress={confirmAmount} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Cash In</Text>
                    </TouchableOpacity>
            </View>
       </View>
       </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    paypandaLogo: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        borderWidth: 0.5,
        borderColor: "silver"
    },
    amountcontent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    cashinbutton: {
        height: 60,
        width: "100%",
        padding: 10,
    },
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
    input: {
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: MEDIUM,
        borderRadius: 5,
        paddingLeft: 20,
        height: 60,
        flexShrink: 1,
        width: 150,
        color: DARK,
        fontWeight: "400",
        fontSize: 30,
        marginBottom: 10,
        textAlign: "center"
      },
})

export default PayPandaComponent