import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,ScrollView,KeyboardAvoidingView,Dimensions} from 'react-native'
import {Separator} from '../../Components'
import {HeaderBack,HeaderTitle,YellowButton} from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import { useSelector } from 'react-redux'
import { AlertOverlay } from '../../../../../../components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {POST_CASH_OUT_BANK_ACCOUNT} from '../../../../../../graphql/toktokwallet'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

const screen = Dimensions.get('window');

const ToktokWalletCashOutSaveAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Add Account','']}/>,
    })
    const bank = route.params.bank
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const fixAccountName = `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`
    const [nickName,setNickName] = useState("")
    const [accountName,setAccountName] = useState(fixAccountName)
   // const [accountName,setAccountName] = useState(bank.accountNameLength < fixAccountName.length ? fixAccountName.slice(0,bank.accountNameLength) : fixAccountName)
    const [accountNumber ,setAccountNumber] = useState("")
    const [address,setAddress] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const [showSuccessModal,setShowSuccessModal] = useState(false)

    const alert = useAlert()

    const [postCashOutBankAccount , {data,error,loading}] = useMutation(POST_CASH_OUT_BANK_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({postCashOutBankAccount})=> {
            console.log(postCashOutBankAccount)
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

        postCashOutBankAccount({
            variables: {
                input: {
                    cashOutBankId: bank.id,
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
                                    placeholder="Enter nickname here"
                                    returnKeyType="done"
                                    maxLength={50}
                            />
                            <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{nickName.length}/50</Text>
                        </View>
                    </View>

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
                                </View>
                        </View>
                    </View>

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[{borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    onChangeText={changeAccountNumber}
                                    maxLength={+bank.accountNumberLength}
                                    placeholder={`Enter bank account number here`}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                />
                                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/{bank.accountNumberLength}</Text>
                        </View>
                    </View>

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    value={address}
                                    maxLength={bank.addressLength}
                                    onChangeText={(value)=>setAddress(value)}
                                    placeholder={`Enter address here`}
                                    returnKeyType="done"
                            />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{address.length}/{bank.addressLength}</Text>
                    </View>
                    

        

                    <View style={{justifyContent:'center',alignItems:"center"}}>
                        <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,marginHorizontal:20}}>Please verify the accuracy and completeness of the details before you proceed.</Text>
                        <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,marginHorizontal: 10}}>By clicking "Confirm", you hereby consent toktokwallet to collect and store any and all information related tot his Saved Bank Account.</Text>
                    </View>
                    <View style={{height: 70,justifyContent:'flex-end',marginBottom: 16}}>
                        <YellowButton label="Confirm" onPress={saveAccount}/>
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

export default ToktokWalletCashOutSaveAccount