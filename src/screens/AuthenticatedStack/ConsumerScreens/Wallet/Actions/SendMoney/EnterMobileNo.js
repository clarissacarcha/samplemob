import React , {useState, useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants'
import {useLazyQuery} from '@apollo/react-hooks'
import {CLIENT,GET_USER_ACCOUNT} from '../../../../../../graphql'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const EnterMobileNo = ({session , navigation , setProceed , setRecipientDetails , mobileNo , setMobileNo})=> {

    const [errorMessage,setErrorMessage] = useState("")

    const [getUserAccount, {data: userInfo, error, loading}] = useLazyQuery(GET_USER_ACCOUNT, {
        fetchPolicy: 'network-only',
        onError: (err) => {
            if(err.graphQLErrors.length > 0){
                err.graphQLErrors.map((error)=> {
                    if(error.message == "Wallet not found"){
                       setProceed(false)
                       return setErrorMessage("Recipient does not have toktok wallet")
                    }else{
                        setProceed(false)
                        return setErrorMessage("Recipient does not have toktok app")
                    }
                })
            }
        },
        onCompleted: (response) => {
            setRecipientDetails(response.getUserAccount)
            checkIFSameNumber(response.getUserAccount.username.replace("+63","0"))
            // return navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: patchFundTransfer})
        }
    })

    const checkIFSameNumber = (mobile) => {
        let sessionMobile = session.user.username.replace("+63","0")
        if(mobile == sessionMobile){
            setErrorMessage("You cannot send money to yourself.")
            setProceed(false)
        }else{
            setErrorMessage("")
            setProceed(true)
        }
    }


    const changeMobileNo = (value)=> {
        const mobile = value.replace(/[^0-9]/g,"")
        
        if(checkMobileFormat(mobile)) {
            checkIFSameNumber(mobile)
        }else{
            setErrorMessage("Please enter a valid mobile number.")
            setProceed(false)
        }

        if(value[0] == "9"){
            setMobileNo("09")
        }else{
            setMobileNo(mobile)
        }
       
    }


    const checkMobileFormat = (mobile)=> {
        if(mobile.length != 11) return false
        if(mobile[1] != "9") return false
        return true
}

    const setRecipientMobileNo = (recipient) => {
        let mobile = recipient.trim()
        if(recipient.slice(0,3) == "+63"){
            mobile = recipient.replace("+63","0")
        }
        mobile = mobile.replace(/[^0-9]/g,"")

        if(checkMobileFormat(mobile)) {
            checkIFSameNumber(mobile)
        }else{
            setErrorMessage("Please enter a valid mobile number.")
            setProceed(false)
        }

        return setMobileNo(mobile)

    }

    useEffect(()=>{
        if(mobileNo == ""){
            setErrorMessage("")
            setProceed(false)
        }
        if(mobileNo.length == 11){
            getUserAccount({
                variables: {
                  input: {
                    mobileNo: mobileNo
                  }
                },
              })
        }

        return ()=> {
            setProceed(false)
        }
    },[mobileNo])


    return (
        <>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 13}}>Enter mobile number</Text>

                <View style={styles.mobileno}>
                        <View style={styles.mobileIcon}>
                            <FIcon5 size={14} name="mobile-alt" />
                        </View>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:"dimgray"}}>{mobileNo == "" ? "Enter mobile number" : mobileNo}</Text>
                            <TextInput
                                    // autoFocus={true}
                                    caretHidden
                                    value={mobileNo}
                                    // ref={inputRef}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onChangeText={(value)=>{
                                            changeMobileNo(value)
                                    }}
                                    // onSubmitEditing={onSubmit}
                            />

                        </View>
                        <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletContacts", {setRecipientInfo: setRecipientMobileNo})} style={styles.contactAddress}>
                            <View style={styles.addressbtn}>
                                    <Text style={{fontFamily: FONT_REGULAR,fontSize: 8,color: "#F6841F"}}>Address Book</Text>
                            </View>
                        </TouchableOpacity>
                </View>

                <View>
                    <Text style={{fontFamily:FONT_REGULAR,fontSize: 11,color:"red",marginTop: 5}}>{errorMessage}</Text>
                </View>
        </>
    )
}

const styles = StyleSheet.create({
   
    mobileno: {
        flexDirection: "row",
        borderWidth: .5,
        borderColor:"silver",
        borderRadius:5,
        padding: 10,
        marginTop: 5
    },
    mobileIcon: {
        width: 22,
        justifyContent:"center"
    },
    contactAddress: {
        width:65,
        borderWidth: 1,
        borderColor: "#F6841F",
        borderRadius: 2,
    },
    addressbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
})


export default EnterMobileNo