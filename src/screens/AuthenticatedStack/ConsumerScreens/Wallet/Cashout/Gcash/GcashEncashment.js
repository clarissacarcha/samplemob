import React , {useState,useCallback,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,Image,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity,Alert,Keyboard} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import { HeaderTitle , HeaderBackClose } from '../../../../../../components'
import {GET_GCASH_ACCOUNT,GET_DAILY_MONTHLY_YEARLY_OUTGOING ,GET_INTERNAL_ACCOUNT , POST_GCASH_ENCASHMENT} from '../../../../../../graphql';
import { useLazyQuery , useMutation} from '@apollo/react-hooks';
import Loader from '../../../../CommonScreens/GCashAccount/Loader';
import {useSelector} from 'react-redux'
import { COLOR, DARK, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES, MEDIUM } from '../../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper';
import ConfirmModalContent from './ConfirmModalContent'
import SuccessfulModal from './SuccessfulModal'
import ConfirmBottomSheet from '../../Components/ConfirmBottomSheet'
import {useAlert} from  '../../../../../../hooks/useAlert'

const GcashEnchashment = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Gcash','']}/>,
    })

    const walletinfo = route.params.walletinfo
    const session = useSelector(state=>state.session)
    const [tempAmount,setTempAmount] = useState("")
    const [amount,setAmount] = useState(0)
    const [data,setData] = useState({getGCashAccount: {record: null}})
    const [errorMessage,setErrorMessage] = useState("")
    const inputRef = useRef()
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const [senderDetails,setSenderDetails] = useState(null)
    const [cashOutGcashInternal , setCashOutGcashInternal] = useState(null)
    const bottomSheetRef = useRef();
    const alert = useAlert()


    const checkSenderWalletLimitation = (amount)=> {
        const outgoingRecords = senderDetails
        const walletLimit = outgoingRecords.walletlimit

        if(walletLimit.outgoingValueDailyLimit){
            if((outgoingRecords.daily + +amount ) > walletLimit.outgoingValueDailyLimit){
                return setErrorMessage("Your daily outgoing wallet limit is reached.")
            }
        }

        if(walletLimit.outgoingValueMonthlyLimit){
            if((outgoingRecords.monthly + +amount ) > walletLimit.outgoingValueMonthlyLimit){
                return setErrorMessage("Your monthly outgoing wallet limit is reached.")
            }
        }

        if(walletLimit.outgoingValueAnnualLimit){
            if((outgoingRecords.yearly + +amount ) > walletLimit.outgoingValueAnnualLimit){
                return setErrorMessage("Your annual outgoing wallet limit is reached.")
            }
        }

        return setErrorMessage("")
    }

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)
        if(num == "") return setErrorMessage("")
        if((num * 0.01) < 1 && num != ""){
            return setErrorMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else if((num * 0.01) > walletinfo.balance){
            return setErrorMessage(`You do not have enough balance`)
        }
        // checkSenderWalletLimitation(num * 0.01)
        setErrorMessage("")
    }

    const [getDailyMonthlyYearlyOutgoing] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_OUTGOING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setSenderDetails(response.getDailyMonthlyYearlyOutgoing)
        }
    })


    const confirmAmount = ()=> {
        Keyboard.dismiss()
        bottomSheetRef.current.snapTo(1)
    }


    const [getGCashAccount, {error , loading}] = useLazyQuery(GET_GCASH_ACCOUNT, {
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          personId: session.user.person.id,
        },
      },
      onError: (e) => console.log(e),
      onCompleted: (res) => setData(res),
    });

    const [getInternalAccount] = useLazyQuery(GET_INTERNAL_ACCOUNT , {
        fetchPolicy: "network-only",
        onError: (e) => console.log(e),
        onCompleted: (response)=>{
            setCashOutGcashInternal(response.getInternalAccount)
        }
    })

    const [postGcashEncashment] = useMutation(POST_GCASH_ENCASHMENT,{
        variables: {
            input: {
                amount: +amount
            }
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
            navigation.pop()
        },
        onCompleted: (response)=>{
            setCashoutLogParams(response.postGcashEncashment.cashoutLog)
            setSuccessModalVisible(true)
        }
    })

    const proceedToEncashment = ()=> {
        bottomSheetRef.current.snapTo(0)
        Keyboard.dismiss()
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postGcashEncashment})
    }


    useFocusEffect(useCallback(()=>{
        getGCashAccount()
        // getDailyMonthlyYearlyOutgoing({
        //     variables: {
        //         input: {
        //             userID: session.user.id
        //         }
        //     }
        // })
        getInternalAccount({
            variables: {
                input: {
                    name: "Gcash"
                }
            }
        })
    },[]))

    if (loading) {
        return <Loader />;
    }
    
    if (error) {
        return <Loader />;
    }


    if(!data.getGCashAccount.record){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Register and verify your Gcash account details</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    if(data.getGCashAccount.record.status === 0){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Account Verification Pending</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    if(data.getGCashAccount.record.status === 2){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Previous account rejected, please update.</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    
    

    return (
        <>
        <SuccessfulModal
            successModalVisible={successModalVisible}
            amount={amount}
            cashoutLogParams={cashoutLogParams}
        />
        <KeyboardAvoidingView  
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 90}  
            behavior={Platform.OS === "ios" ? "padding" : "height"}  
            style={styles.container}
        >
            <View style={styles.gcashAccountInfo}>
                <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                <View style={styles.details}>
                     <Text style={{marginLeft: 15,fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>{`${data.getGCashAccount.record.firstName} ${data.getGCashAccount.record.middleName ? data.getGCashAccount.record.middleName + " " : ""}${data.getGCashAccount.record.lastName}`}</Text>
                     <Text style={{marginLeft: 15,fontSize: SIZES.S,fontFamily: FONT_REGULAR}}>{data.getGCashAccount.record.mobileNumber}</Text>
                     <Text style={{marginLeft: 15,fontSize: SIZES.XS,fontFamily: FONT_LIGHT}}>Gcash account verified <FIcon5 style={{color:"green"}} name="check"/></Text>
                </View>
            </View>
            <View style={styles.content}>
            <View style={styles.amountcontent}>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                    // autoFocus={true}
                                    caretHidden
                                    value={tempAmount}
                                    ref={inputRef}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onChangeText={changeAmount}
                                    // onSubmitEditing={onSubmit}
                            />
                            {/* <Text style={{fontSize: 40,fontFamily: FONT_MEDIUM , alignSelf:"center"}}>{'\u20B1'}</Text>
                                <View style={styles.input}>
                                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 30}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                </View>
                                <FIcon5 name="pen" style={{alignSelf:"center"}} size={18} color="gray"/> */}
                            <View style={styles.input}>
                                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 30,marginRight: 15}}>PHP</Text>
                                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 30}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                <FIcon5 name="pen" style={{alignSelf:"center",marginLeft: 25}} size={18} color="gray"/>
                            </View>
                        </View>
                        <Text style={{color:"gray",fontSize: 14,fontFamily: FONT_REGULAR}}>Current Balance PHP {numberFormat(walletinfo.balance)}</Text>
                        <Text style={{fontFamily: FONT_REGULAR, color: "red",marginTop: 5,fontSize: 12}}>{errorMessage}</Text>
            </View>

            <View style={styles.cashoutbutton}>
                    <TouchableOpacity 
                        disabled={(amount != "" && amount <= walletinfo.balance && amount >= 1 ) ? false : true}
                        onPress={confirmAmount} 
                        style={{height: "100%",width: "100%",backgroundColor: (amount != "" && amount <= walletinfo.balance && amount >= 1 ) ? DARK : "gray", borderRadius: 10, justifyContent: "center",alignItems: "center"}}
                    >
                        <Text style={{color: (amount != "" && amount <= walletinfo.balance && amount >= 1 ) ? COLOR : "white",fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Cash Out</Text>
                    </TouchableOpacity>
            </View>
            </View>
        </KeyboardAvoidingView> 

        <ConfirmBottomSheet
            bottomSheetRef={bottomSheetRef}
            onPress={proceedToEncashment}
            headerTitle="Review and Confirm" 
            btnLabel="Confirm"
        >
              <ConfirmModalContent amount={amount}/>
        </ConfirmBottomSheet>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    gcashAccountInfo: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        borderWidth: 0.5,
        borderColor: "silver"
    },
    details: {
        alignSelf: "center"
    },
    amountcontent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        marginHorizontal: 20,
        borderRadius: 5,
        height: 60,
        // flexShrink: 1,
        flex: 1,
        flexDirection:"row",
        width: 150,
        color: DARK,
        justifyContent:"center",
        alignItems:"center"
    },
    cashoutbutton: {
        height: 50,
        width: "100%",
    },
    registerBtnView: {
        padding: 10,
    },
    registerBtn: {
        justifyContent:"center",
        alignItems:"center",
        height: 20,
        width: "100%",
        backgroundColor:DARK,
        paddingVertical: 18,
        borderRadius: 5,
    },
    registerBtnText: {
        color: COLOR,
        fontFamily: FONT_REGULAR
    }
})

export default GcashEnchashment

