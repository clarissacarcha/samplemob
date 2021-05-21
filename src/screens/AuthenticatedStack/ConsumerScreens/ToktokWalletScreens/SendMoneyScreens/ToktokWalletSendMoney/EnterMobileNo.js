import React , {useState, useEffect , useRef} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Dimensions,TouchableHighlight} from 'react-native'
import {SIZES, INPUT_HEIGHT, FONTS, COLORS} from '../../../../../../res/constants'
import {useLazyQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { GET_ACCOUNT } from '../../../../../../graphql/toktokwallet'
import { Alert } from 'react-native'

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
    const inputMobileRef = useRef()

    const [getAccount, {data: walletData,error: walletError,loading: walletLoading}] = useLazyQuery(GET_ACCOUNT , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getAccount})=>{
            setRecipientDetails(getAccount)
            checkIFSameNumber(getAccount.mobileNumber.replace("+63","0"))
        },
        onError: (err)=> {
            if(err.graphQLErrors.length > 0){
                err.graphQLErrors.map((error)=> {
                    if(error.message == "Person doesn't registered in toktokwallet") {
                        setProceed(false)
                        return setErrorMessage("Recipient does not have toktokwallet")
                    }
                   
                })
            }
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
            getAccount({
                variables: {
                    input: {
                        mobileNumber: mobileNo
                    }
                }
            })
        }

        return ()=> {
            setProceed(false)
        }
    },[mobileNo])

    useEffect(()=>{
        console.log(recipientDetails)
    },[recipientDetails])

    return (
       <View style={styles.container}>
            <View style={styles.content}>

                <TouchableOpacity onPress={()=>inputMobileRef.current.focus()} style={{flex: 1,justifyContent:"center",paddingHorizontal: 10, height:"100%"}}>
                    <>
                { recipientDetails.id && proceed && <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{`${recipientDetails.person.firstName} ${recipientDetails.person.lastName[0]}.`}</Text>}
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: recipientDetails.id && proceed ? SIZES.M : SIZES.M,color:"dimgray"}}>{mobileNo == "" ? "Enter Recipient Number" : mobileNo}</Text>
                { errorMessage != "" && <Text style={{fontFamily:FONTS.REGULAR,fontSize: SIZES.S,color:"red",marginTop: 0}}>{errorMessage}</Text>}
                    <TextInput
                        ref={inputMobileRef}
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
                    </>
                </TouchableOpacity>
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