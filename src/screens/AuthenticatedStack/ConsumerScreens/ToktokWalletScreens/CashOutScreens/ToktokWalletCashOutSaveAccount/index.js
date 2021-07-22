import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,ScrollView,KeyboardAvoidingView,Dimensions} from 'react-native'
import {Separator} from '../../Components'
import {HeaderBack,HeaderTitle,YellowButton} from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
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

    const bank = route.params.bank
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[bank.name.length < 20 ? bank.name : bank.name.slice(0,20)+'...','']}/>,
    })
    const alert = useAlert()
    
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const fixAccountName = `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`
    const [nickName,setNickName] = useState("")
    const [accountName,setAccountName] = useState(fixAccountName)
    const [accountNumber ,setAccountNumber] = useState("")
    const [address,setAddress] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const [showSuccessModal,setShowSuccessModal] = useState(false)
    const [errorListMessage, setErrorListMessage] = useState({
        alias: "",
        accountNumber: "",
        address: "",
    })

    useEffect(()=>{
        if(route.params.cashoutLogParams){
            const params = route.params.cashoutLogParams
            setAccountNumber(params.accountNumber)
            setAddress(params.address)
        }
    },[])

    const changeErrorMessagge = (key,value)=> {
        setErrorListMessage(oldstate=>({
            ...oldstate,
            [key]: value
        }))
        
    }

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

    const saveAccount =async ()=> {
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
        setAccountNumber(num)
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
                    {/* <View style={styles.bank}>            
                            <Text style={styles.bankName}>{bank.name}</Text>
                    </View> */}
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

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center",backgroundColor:"#F0F0F0"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
                                </View>
                        </View>
                    </View>

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[{borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.accountNumber == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    onChangeText={changeAccountNumber}
                                    maxLength={19}
                                    placeholder={`Enter bank account number here`}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/19 
                            {errorListMessage.accountNumber != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.accountNumber}</Text>}
                        </Text>
                    </View>

                    <View style={{marginBottom: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                        <View style={[{borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.address == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    value={address}
                                    maxLength={20}
                                    onChangeText={(value)=>setAddress(value)}
                                    placeholder={`Enter address here`}
                                    returnKeyType="done"
                            />
                        </View>
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{address.length}/20 
                            {errorListMessage.address != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.address}</Text>}
                        </Text>
                    </View>
                    

        

                    <View style={{justifyContent:'center',alignItems:"center"}}>
                        <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,marginHorizontal:20}}>Please verify the accuracy and completeness of the details before you proceed.</Text>
                        <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,marginHorizontal: 10}}>By clicking "Confirm", you hereby consent toktokwallet to collect and store any and all information related tot his Saved Bank Account.</Text>
                    </View>
                     
             </ScrollView>
             <View style={{height: 70,justifyContent:'flex-end'}}>
                        <YellowButton label="Confirm" onPress={saveAccount}/>
                    </View>   
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