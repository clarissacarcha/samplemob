import React , {useState,useCallback,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,Image,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity,Alert,Keyboard} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import { HeaderTitle , HeaderBackClose } from '../../../../../../components'
import {GET_INTERNAL_ACCOUNT , POST_GCASH_ENCASHMENT } from '../../../../../../graphql';
import { useLazyQuery , useMutation} from '@apollo/react-hooks';
import Loader from '../../../../CommonScreens/GCashAccount/Loader';
import {useSelector} from 'react-redux'
import { DARK, SIZES, COLORS, FONTS } from '../../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper';
import {useAlert} from  '../../../../../../hooks/useAlert'
import {
    ConfirmBottomSheet,
    DisabledButton,
    Separator
} from '../../Components'

//SELF IMPORTS
import ConfirmModalContent from './ConfirmModalContent'
import SuccessfulModal from './SuccessfulModal'
import { HeaderBack, YellowButton } from '../../../../../../revamp';


const ToktokWalletGcashCashOut = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash Out','']}/>,
    })

    const walletinfo = route.params.walletinfo
    const gcashAccount = route.params.gcashAccount
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
    const alert = useAlert()



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


    const confirmAmount = ()=> {
        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Cash Out" , 
            data: {
                    method: "GCash" , 
                    amount: amount
                },
            onConfirm: postGcashEncashment,
        })
    }


    const [getInternalAccount] = useLazyQuery(GET_INTERNAL_ACCOUNT , {
        fetchPolicy: "network-only",
        onError: (e) => console.log(e),
        onCompleted: (response)=>{
            setCashOutGcashInternal(response.getInternalAccount)
        }
    })

    const proceedToEncashment = ()=> {
        // bottomSheetRef.current.snapTo(0)
        // Keyboard.dismiss()
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postGcashEncashment})
    }

    useEffect(()=>{
        getInternalAccount({
            variables: {
                input: {
                    name: "Gcash"
                }
            }
        })
    },[])

    

    return (
        <>
        <SuccessfulModal
            successModalVisible={successModalVisible}
            amount={amount}
            cashoutLogParams={cashoutLogParams}
        />
        <Separator />
        <KeyboardAvoidingView  
            // keyboardVerticalOffset={Platform.OS == "ios" ? 90 : 90} 
            keyboardVerticalOffset={90}  
            behavior={Platform.OS === "ios" ? "padding" : "height"}  
            style={styles.container}
        >

            <View style={styles.gcashLogo}>
                     <Image style={{height: 90,width: 90,alignSelf: "center",marginBottom: 9}} source={require('../../../../../../assets/toktokwallet-assets/gcash.png')}/>
                     <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR , color: "#00C851"}}>Verified <FIcon5 style={{color:"#00C851"}} name="check"/></Text>
                     <Text style={{fontSize: SIZES.L,color:COLORS.DARK,fontFamily: FONTS.BOLD}}>{`${gcashAccount.firstName} ${gcashAccount.middleName ? gcashAccount.middleName + " " : ""}${gcashAccount.lastName}`}</Text>
                     <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR , color:COLORS.DARK}}>{gcashAccount.mobileNumber}</Text>
            </View>

            <View style={styles.content}>
            <View style={styles.amountcontent}>
                    <View style={{flexDirection: "row"}}>
                        <TextInput
                                caretHidden
                                value={tempAmount}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                onChangeText={changeAmount}
                        />
                        <View style={styles.input}>
                            <Text style={{fontFamily: FONTS.BOLD,fontSize: 32,marginRight: 10,color:COLORS.YELLOW}}>PHP</Text>
                            <Text style={{fontFamily: FONTS.BOLD,fontSize: 32,color: COLORS>DARK}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                            <FIcon5 name="pen" style={{alignSelf:"center",marginLeft: 20}} size={20} color={COLORS.DARK}/>
                        </View>
                    </View>
                    <Text style={{color:COLORS.DARK,fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Available Balance PHP {numberFormat(walletinfo.balance)}</Text>
                    <Text style={{fontFamily: FONTS.REGULAR, color: "red",marginTop: 5,fontSize: SIZES.S}}>{errorMessage}</Text>
            </View>

            <View style={styles.cashoutbutton}>
                    {
                        (amount != "" && amount <= walletinfo.balance && amount >= 1 )
                        ? <YellowButton label="Cash Out" onPress={confirmAmount}/>
                        : <DisabledButton label="Cash Out" />
                    }
            </View>
            </View>
        </KeyboardAvoidingView> 
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    content: {
        flex: 1,
    },
    gcashLogo: {
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        marginTop: 30,
    },
    gcashAccountInfo: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 0.2,
        borderColor: "silver"
    },
    details: {
        alignSelf: "center"
    },
    amountcontent: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 30,
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
})


export default ToktokWalletGcashCashOut

