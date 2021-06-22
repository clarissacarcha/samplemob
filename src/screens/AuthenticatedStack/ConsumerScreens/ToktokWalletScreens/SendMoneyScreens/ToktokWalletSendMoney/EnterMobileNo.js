import React , {useState, useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Dimensions} from 'react-native'
import {SIZES, INPUT_HEIGHT, FONTS, COLORS} from '../../../../../../res/constants'
import {useLazyQuery} from '@apollo/react-hooks'
import {CLIENT,GET_USER_ACCOUNT,GET_DAILY_MONTHLY_YEARLY_INCOMING} from '../../../../../../graphql'


const {width,height} = Dimensions.get("window")

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
       <View style={styles.container}>
            <View style={styles.content}>

                <View style={{flex: 1,paddingHorizontal: 10,}}>
                { recipientDetails.id && proceed && <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{`${recipientDetails.person.firstName} ${recipientDetails.person.lastName[0]}.`}</Text>}
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: recipientDetails.id && proceed ? SIZES.M : SIZES.M,color:"dimgray"}}>{mobileNo == "" ? "Enter Recipient Number" : mobileNo}</Text>
                { errorMessage != "" && <Text style={{fontFamily:FONTS.REGULAR,fontSize: SIZES.S,color:"red",marginTop: 0}}>{errorMessage}</Text>}
                    <TextInput
                        caretHidden
                        // autoFocus={true}
                        value={mobileNo}
                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onChangeText={(value)=>{
                                changeMobileNo(value)
                        }}
                        // onBlur={()=>{
                        //     getUserAccount({
                        //         variables: {
                        //           input: {
                        //             mobileNo: mobileNo
                        //           }
                        //         },
                        //       })
                        // }}
                    />
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletContacts", {setRecipientInfo: setRecipientMobileNo})} style={styles.contactAddress}>
                    <View style={styles.addressbtn}>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.XS,color: COLORS.YELLOW}}>Address Book</Text>
                    </View>
                </TouchableOpacity>
            </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: INPUT_HEIGHT,
        width: width,
        paddingHorizontal: 16,
        position:"absolute",  
        bottom: -25,
    },
    content: {
        height:"100%",
        width:"100%",
        alignSelf:"center",
        backgroundColor:"white",
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        flexDirection: "row" 
    },
    contactAddress: {
        // width:65,
        height: SIZES.XS + 12,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderColor: COLORS.YELLOW,
        borderRadius: 3,
        marginRight: 10,
    },
    addressbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
})

export default EnterMobileNo