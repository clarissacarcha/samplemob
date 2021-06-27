import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,TouchableOpacity,Dimensions,KeyboardAvoidingView,ScrollView} from 'react-native'
import {Separator} from '../../Components'
import {HeaderBack,HeaderTitle,YellowButton} from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { useSelector } from 'react-redux'
import { AlertOverlay } from '../../../../../../components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {PATCH_CASH_OUT_BANK_ACCOUNT} from '../../../../../../graphql/toktokwallet'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

const screen = Dimensions.get('window');

const ToktokWalletCashOutUpdateAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Update Account','']}/>,
    })

    const alert = useAlert()
    const bankAccount = route.params.bankAccount
    const bank = bankAccount.bank
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [nickName,setNickName] = useState(bankAccount.nickName)
    const [accountName,setAccountName] = useState(bankAccount.accountName)
    const [accountNumber ,setAccountNumber] = useState(bankAccount.accountNumber)
    const [address,setAddress] = useState(bankAccount.address)
    const [errorMessage,setErrorMessage] = useState("")
    const [showSuccessModal,setShowSuccessModal] = useState(false)

    const [errorListMessage, setErrorListMessage] = useState({
        alias: "",
        accountNumber: "",
        address: "",
    })

    const changeErrorMessagge = (key,value)=> {
        setErrorListMessage(oldstate=>({
            ...oldstate,
            [key]: value
        }))
        
    }

    const [patchCashOutBankAccount , {data,error,loading}] = useMutation(PATCH_CASH_OUT_BANK_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({patchCashOutBankAccount})=> {
            // console.log(patchCashOutBankAccount)
            setShowSuccessModal(true)
        }
    })

    const saveAccount = ()=> {
        let noError = true
        if(nickName == ""){
            changeErrorMessagge("alias","Alias is required.")
            noError = false
        }
        if(accountNumber == ""){
            changeErrorMessagge("accountNumber","Account Number is required.")
            noError = false
        }
        if(address == ""){
            changeErrorMessagge("address","Account Address is required.")
            noError = false
        }

        if(!noError) return

        patchCashOutBankAccount({
            variables: {
                input: {
                    accountId: bankAccount.id,
                    cashOutBankId: bank.id,
                    oldAccountNumber: bankAccount.accountNumber,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    nickName: nickName,
                    address: address,
                }
            }
        })
    }

    useEffect(()=>{
        if(nickName.length > 0){
            changeErrorMessagge("alias","")
        }
        if(accountNumber.length > 0) {
            changeErrorMessagge("accountNumber","")
        }
        if(address.length > 0){
            changeErrorMessagge("address","")
        }
    },[nickName,accountNumber,address])


    const changeAccountNumber = (value)=> {
        const num = value.replace(/[^0-9.]/g, '')
        setAccountNumber(num)
    }
    
    return (
        <>
        <AlertOverlay visible={loading}/>
        <SuccessfulModal visible={showSuccessModal} setVisible={setShowSuccessModal}/>
        <Separator/>
        <View style={styles.container}>
        <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.1 : screen.height * 0.25}
                        style={{ flex: 1 }}
                >
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={styles.bank}>                
                            <Text style={styles.bankName}>{bank.name}</Text>
                    </View>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Alias</Text>
                        <View style={[{borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.alias == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={nickName}
                                    onChangeText={(value)=>setNickName(value)}
                                    placeholder="Enter alias here"
                                    returnKeyType="done"
                                    maxLength={50}
                            />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{nickName.length}/50 
                            {errorListMessage.alias != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.alias}</Text>}
                        </Text>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center",backgroundColor:"#F0F0F0"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
                                </View>
                        </View>
                    </View>
                    
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[{borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.accountNumber == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    onChangeText={changeAccountNumber}
                                    maxLength={19}
                                    placeholder={`Enter bank account number here`}
                                    returnKeyType="done"
                                    keyboardType="number-pad"
                                />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/19 
                            {errorListMessage.accountNumber != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.accountNumber}</Text>}
                        </Text>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                        <View style={[{borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.address == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={address}
                                    onChangeText={(value)=>setAddress(value)}
                                    placeholder={`Enter address here`}
                                    returnKeyType="done"
                                    maxLength={20}
                                />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{address.length}/20 
                            {errorListMessage.address != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.address}</Text>}
                        </Text>
                    </View>
    
             <View style={{justifyContent:'center',alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,}}>Please verify the accuracy and completeness of the details before you proceed.</Text>
             </View>
             <View style={{height: 70,justifyContent:'flex-end'}}>
                <YellowButton label="Update" onPress={saveAccount}/>
             </View>
             </ScrollView>
             </KeyboardAvoidingView>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding: 16,
    },
    bank: {
        alignItems:'center',
        marginBottom: 20,
    },  
    bankLogo: {
        height: 50,
        width: 50,
        backgroundColor:"white",
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginRight: 10,
      },
    bankName: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.XL,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
})

export default ToktokWalletCashOutUpdateAccount