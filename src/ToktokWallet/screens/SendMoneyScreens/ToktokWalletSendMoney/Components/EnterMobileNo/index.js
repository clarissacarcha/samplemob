import React , {useState, useEffect , useRef} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Dimensions, Alert} from 'react-native'
import {useLazyQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_ACCOUNT } from 'toktokwallet/graphql'
import { useContacts } from 'toktokwallet/hooks'
import { ContactSuggestion } from 'toktokwallet/components'
import heart from "toktokwallet/assets/images/heart.png"
import heartFill from "toktokwallet/assets/images/heart-fill.png"
import {FavoritesContext } from "../ContextProvider"
import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const {width,height} = Dimensions.get("window")

export const EnterMobileNo = ({
    navigation , 
    setProceed , 
    proceed ,
    setRecipientDetails , 
    mobileNo , 
    setMobileNo , 
    recipientDetails,
    tokwaAccount,
    setGetAccountLoading,
    favoritesRef
})=> {
    const { favorites } = useContext(FavoritesContext)
    const [errorMessage,setErrorMessage] = useState("")
    const [suggestContact,setSuggestContact] = useState("")
    const [isFavorite,setIsFavorite] = useState(false);
    const inputMobileRef = useRef()
    const { contacts } = useContacts();

    
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
                        return setErrorMessage("Recipient must have toktokwallet account.")
                    }
                   
                })
            }
        }
    })

    const checkIFSameNumber = (mobile) => {
        let sessionMobile = tokwaAccount.mobileNumber.replace("+63","0")
        if(mobile == sessionMobile){
            setErrorMessage("You cannot send money to yourself.")
            setProceed(false)
        }else{
            setErrorMessage("")
            setProceed(true)
        }
    }


    const filterByContacts = (value)=> {
        if(value.length >= 4){
            const result = contacts.filter((contact)=>{
                return contact.name.toLowerCase().includes(value.toLowerCase()) || contact.number.toLowerCase().includes(value.toLowerCase())
            })
            return result[0]
        }
        return null
    }


    const changeMobileNo = (text)=> {
        // enable if type name is an option
        const filteredContact = filterByContacts(text)
        setSuggestContact(filteredContact)
        // const value = text.replace(/[^0-9 A-Za-z]/g,"")
        const value = text.replace(/[^0-9]/g,"")

        if(value.length > 11) return
        
        if(checkMobileFormat(value)) {
            checkIFSameNumber(value)
        }else{
            setErrorMessage("Mobile number must be valid.")
            setProceed(false)
        }

        if(value[0] == "9" && value.length >= 3){
            setMobileNo("0"+value)
        }else{
            setMobileNo(value)
        }
       
    }


    const checkMobileFormat = (mobile)=> {
        if(mobile.length != 11) return false
        if(mobile.slice(0,2) != "09") return false
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

    const fetchRecipientInfo = ()=> {
        getAccount({
            variables: {
                input: {
                    mobileNumber: mobileNo
                }
            }
        })
    }

    useEffect(()=>{
        if(mobileNo == ""){
            setErrorMessage("")
            setProceed(false)
        }
        if(mobileNo.length == 11){
            fetchRecipientInfo()
        }

        return ()=> {
            setProceed(false)
        }
    },[mobileNo])

    useEffect(()=>{
       if(recipientDetails.id){
           const result = favoritesRef.current.checkIfFavorites(recipientDetails.id)
           setIsFavorite(result)
       }
    },[recipientDetails,favorites])

    useEffect(()=>{
        setGetAccountLoading(walletLoading)
    },[walletLoading])

    return (
        <>
         
       <View style={styles.container}>
            <ContactSuggestion
                contactInfo={suggestContact}
                setContactInfo={setSuggestContact}
                onPress={setRecipientMobileNo}
            />
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>{
                    return inputMobileRef.current.focus()
                }} style={{flex: 1,justifyContent:"center",paddingHorizontal: 10, height:50}}>
                    <>
                    { recipientDetails.id && proceed && <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{`${recipientDetails.person}`}</Text>}
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: recipientDetails.id && proceed ? FONT_SIZE.M : FONT_SIZE.M,color:"dimgray"}}>{mobileNo == "" ? "Enter Recipient Number" : mobileNo}</Text>
                    { errorMessage != "" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED,marginTop: 0}}>{errorMessage}</Text>}

                
                    <View style={{flex: 1,position:"relative"}}>
                     { recipientDetails.id && proceed && <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,position:"absolute",marginTop:5}}>{`${recipientDetails.person.firstName} ${recipientDetails.person.lastName[0]}.`}</Text>}
                        <TextInput
                            ref={inputMobileRef}
                        
                            // autoFocus={true}
                            value={mobileNo}
                            style={{ width: '100%',height: errorMessage ? 35 : 50,padding:0,fontSize: FONT_SIZE.M,marginTop: recipientDetails.id && proceed ? 5 : 0}}
                            // keyboardType="number-pad"
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value)=>{
                                    changeMobileNo(value)
                            }}
                            // placeholder="Enter recipient name or number"
                            placeholder="Enter recipient number"
                        />
                          
                       {errorMessage != "" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.XS,color:COLOR.RED,marginTop: -5}}>{errorMessage}</Text>}
                     </View>
                     </>
                </TouchableOpacity>
                {
                    recipientDetails.id && errorMessage == "" &&
                    <TouchableOpacity onPress={()=>favoritesRef.current.addFavorites(recipientDetails.id)} style={styles.addFavorites}>
                        <Image resizeMode="contain" style={styles.heart} source={isFavorite ? heartFill : heart}/>
                    </TouchableOpacity>
                }
            
                <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletContacts", {setRecipientInfo: setRecipientMobileNo})} style={styles.contactAddress}>
                    <View style={styles.addressbtn}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS,color: COLOR.YELLOW}}>Address Book</Text>
                    </View>
                </TouchableOpacity>

               
            </View>
       </View>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: SIZE.FORM_HEIGHT,
        width: width,
        paddingHorizontal: 16,
        marginTop: -25,
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
    },
    contactAddress: {
        // width:65,
        height: FONT_SIZE.XS + 12,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderColor: COLOR.YELLOW,
        borderRadius: 3,
        marginRight: 10,
        zIndex: 1,
    },
    addFavorites: {
       justifyContent:"center",
       alignItems:"center"
    },
    heart: {
        height: FONT_SIZE.XS + 12,
        width: FONT_SIZE.XS + 12,
        marginHorizontal: 5
    },
    addressbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
})
