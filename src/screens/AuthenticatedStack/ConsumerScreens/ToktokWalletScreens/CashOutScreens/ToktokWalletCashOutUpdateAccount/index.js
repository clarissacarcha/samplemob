import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,TouchableOpacity,Dimensions,KeyboardAvoidingView,ScrollView} from 'react-native'
import {Separator} from '../../Components'
import {HeaderBack,HeaderTitle,YellowButton} from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
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
   
    const bankAccount = route.params.bankAccount
    const bank = bankAccount.bank
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [nickName,setNickName] = useState(bankAccount.nickName)
    const [accountName,setAccountName] = useState(bankAccount.accountName)
    const [accountNumber ,setAccountNumber] = useState(bankAccount.accountNumber)
    const [address,setAddress] = useState(bankAccount.address)
    const [errorMessage,setErrorMessage] = useState("")
    const [showSuccessModal,setShowSuccessModal] = useState(false)
  
    const alert = useAlert()

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
        if(nickName == ""){
            return Alert.alert("","Alias is required.")
        }

        if(accountNumber == ""){
            return Alert.alert("","Account Number is required.")
        }

        if(address == ""){
            return Alert.alert("","Account Address is required.")
        }

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

    const changeAccountNumber = (value)=> {
        const num = value.replace(/[^0-9.]/g, '')
        // if(value.length != +bank.accountNumberLength){
        //     setErrorMessage("Account number format must be valid.")
        // }

        setAccountNumber(num)
    }
    

    // useEffect(()=>{
    //     if(accountNumber == "" || accountNumber.length === +bank.accountNumberLength) setErrorMessage("")
    // },[accountNumber])

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
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput
                                    style={styles.input}
                                    value={nickName}
                                    onChangeText={(value)=>setNickName(value)}
                                    placeholder="Enter alias here"
                                    returnKeyType="done"
                                    maxLength={50}
                            />
                            <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{nickName.length}/50</Text>
                        </View>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
                                </View>
                        </View>
                    </View>
                    
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[{borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    onChangeText={changeAccountNumber}
                                    maxLength={+bank.accountNumberLength}
                                    placeholder={`Enter bank account number here`}
                                    returnKeyType="done"
                                    keyboardType="number-pad"
                                />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/{bank.accountNumberLength}</Text>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput
                                    style={styles.input}
                                    value={address}
                                    onChangeText={(value)=>setAddress(value)}
                                    placeholder={`Enter address here`}
                                    returnKeyType="done"
                                />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{address.length}/{bank.addressLength}</Text>
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