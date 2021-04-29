import React , {useState, useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import { BUTTON_HEIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES, INPUT_HEIGHT } from '../../../../../../res/constants'
import {useLazyQuery} from '@apollo/react-hooks'
import {CLIENT,GET_USER_ACCOUNT,GET_DAILY_MONTHLY_YEARLY_INCOMING} from '../../../../../../graphql'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import ConfirmModal from '../../Components/ConfirmModal'

const EnterMobileNo = ({
    session , 
    navigation , 
    setProceed , 
    proceed ,
    setRecipientDetails , 
    mobileNo , 
    setMobileNo , 
    recipientDetails
})=> {

    const [errorMessage,setErrorMessage] = useState("")

    const [getUserAccount, {data: userInfo, error, loading}] = useLazyQuery(GET_USER_ACCOUNT, {
        fetchPolicy: 'network-only',
        onError: (err) => {
            if(err.graphQLErrors.length > 0){
                err.graphQLErrors.map((error)=> {
                    if(error.message == "Wallet not found"){
                       setProceed(false)
                       return setErrorMessage("Recipient does not have toktokwallet")
                    }else{
                        setProceed(false)
                        return setErrorMessage("Recipient does not have toktok app")
                    }
                })
            }
        },
        onCompleted: (response) => {
            setRecipientDetails(oldstate=> {
                return {
                    ...oldstate,
                    ...response.getUserAccount
                }
            })
            checkIFSameNumber(response.getUserAccount.username.replace("+63","0"))
            // getDailyMonthlyYearlyIncoming({
            //     variables: {
            //         input: {
            //             userID: response.getUserAccount.id
            //         }
            //     }
            // })
            // return navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: patchFundTransfer})
        }
    })

    const [getDailyMonthlyYearlyIncoming] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_INCOMING , {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=>{
            setRecipientDetails(oldstate=> {
                return {
                    ...oldstate,
                    incomingRecords: response.getDailyMonthlyYearlyIncoming
                }
            })
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

        if(mobile.length > 11) return
        
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
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>Enter mobile number</Text>

                <View style={styles.mobileno}>
                        <View style={styles.mobileIcon}>
                            <FIcon5 size={SIZES.XL} name="mobile-alt" />
                        </View>
                        <View style={{
                            flex: 1,
                        }}>
                             { recipientDetails.id && proceed && <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.S}}>{`${recipientDetails.person.firstName} ${recipientDetails.person.lastName[0]}.`}</Text>}
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: recipientDetails.id && proceed ? SIZES.S : SIZES.M,color:"dimgray"}}>{mobileNo == "" ? "Enter mobile number" : mobileNo}</Text>
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
                        <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletContacts", {setRecipientInfo: setRecipientMobileNo})} style={styles.contactAddress}>
                            <View style={styles.addressbtn}>
                                    <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.XS,color: "#F6841F"}}>Address Book</Text>
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
        paddingHorizontal: 10,
        marginTop: 5,
        height: INPUT_HEIGHT,
        justifyContent:"center",
        alignItems:"center"
    },
    mobileIcon: {
        width: 22,
        justifyContent:"center"
    },
    contactAddress: {
        // width:65,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#F6841F",
        borderRadius: 2,
        height: INPUT_HEIGHT - 20
    },
    addressbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
})


export default EnterMobileNo