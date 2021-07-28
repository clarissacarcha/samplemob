import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,TextInput,ActivityIndicator} from 'react-native'
import { YellowButton, VectorIcon , ICON_SET  } from '../../../../../revamp'
import { COLOR , FONT_SIZE , FONT , SIZE } from '../../../../../res/variables'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_CHECK_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../hooks'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { DisabledButton } from '../Components'

const LoadingPage = ()=> {
    return (
        <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator/>
        </View>
    )
}


const RiderNoLinkAccount = ()=> {

    const [mobileNo,setMobileNo] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert()
    const navigation = useNavigation()
    const session = useSelector(state=>state.session)
    const [mounted,setMounted] = useState(true)
    const [pageLoading,setPageLoading] = useState(true)
    const [tokwaAccount,setTokwaAccount] = useState(null)

    const [getCheckAccount, {data ,error ,loading}] = useLazyQuery(GET_CHECK_ACCOUNT, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getCheckAccount})=> {
            setMobileNo("")
            setErrorMessage("")
            // navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: getCheckAccount})
            setTokwaAccount(getCheckAccount)
        },
        onError: (error)=> {
            // onErrorAlert({alert,error})
            if(error.graphQLErrors.length > 0){
                error.graphQLErrors.map((err)=> {
                    setErrorMessage("toktokwallet account does not exist")
                })
                return
            }

            onErrorAlert({alert,error})

        }
    })

    const checkTokwaAccount = ()=>{
        getCheckAccount({
            variables:{
                input: {
                    mobileNumber: `09${mobileNo}`,
                    motherReferenceNumber: session.user.id,
                }
            }
        })
    }

    const changeMobileNo = (value)=> {
        const mobile = value.replace(/[^0-9]/g,"")

        if(mobile.length == 0){
             setErrorMessage("")
             setMobileNo(mobile)
             return
        }

        // if(mobile.length > 10 && mobile.slice(0,2) == "09"){
        //     setErrorMessage("")
        // }else{
        //     setErrorMessage("Mobile number must be valid.")
        // }

        if(mobile.length > 8){
            setErrorMessage("")
        }else{
            setErrorMessage("Mobile number must be valid.")
        }
        if(mobile.length > 9) return
    
        // if(value[0] == "9"){
        //     setMobileNo("09")
        // }else{
        //     setMobileNo(mobile)
        // }
        setMobileNo(mobile)
       
    }

    // useEffect(()=>{
    //    DisplayComponent()
    // },[tokwaAccount])


    useEffect(()=>{
        setMounted(true)
        if(mounted){
            getCheckAccount({
                variables:{
                    input: {
                        mobileNumber: session.user.username,
                        // mobileNumber: '+639270752905',
                        motherReferenceNumber: session.user.id,
                    }
                }
            })
            setPageLoading(false)
           
        }
        return ()=> setMounted(false)
    },[])

    const DisplayComponent = ()=>{
        if(pageLoading){
            return <LoadingPage/>
        }

        if(tokwaAccount){
            return <Text>wp</Text>
        }
        
        if(!tokwaAccount){
            return <Text>gg</Text>
        }
        
    }


    return (
        <>
            {
               DisplayComponent()
                
                
            //     <>   
                
            //     <View style={styles.content}>
            //     <Text style={styles.labelText}>Please enter your mobile number to link toktokwallet account</Text>
            //     <Text style={[styles.labelSmall]}>Link your existing toktokwallet account.</Text>  
            //     <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,marginTop: 10,}}>Mobile Number</Text>
            //     <View style={{flexDirection:"row",alignItems:"center",width:"100%"}}>
            //     <View style={{ backgroundColor:'lightgray', borderTopLeftRadius: SIZE.BORDER_RADIUS,borderBottomLeftRadius: SIZE.BORDER_RADIUS,justifyContent:"center",alignItems:"center", height: SIZE.BUTTON_HEIGHT,paddingHorizontal: 10,marginTop: 5}}>
            //             <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,paddingBottom: 2.5}}>09</Text>
            //     </View>
            //     <TextInput 
            //             style={[styles.input, {fontSize: FONT_SIZE.L + 1,fontFamily: FONT.REGULAR, flex: 1,borderTopLeftRadius: 0,borderBottomLeftRadius: 0, borderWidth: 1, borderColor: errorMessage != "" ? COLOR.RED : "transparent"}]} 
            //             placeholder="00-000-0000"
            //             keyboardType="number-pad"
            //             placeholderTextColor={COLOR.DARK}
            //             value={mobileNo}
            //             returnKeyType="done"
            //             onChangeText={changeMobileNo}
            //     />
            //     </View>
            //     <Text style={{fontFamily: FONT.REGULAR,color:COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
            // </View>

            // <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
            //     {
            //         mobileNo.length == 9
            //         ? <YellowButton label="Link Now" onPress={checkTokwaAccount}/>
            //         : <DisabledButton label="Link Now"/>
            //     }
                
            // </View> </>
            }
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 16,
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S,
        textAlign:'left'
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
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    labelSmall: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color:"#929191"
    },
})


export default RiderNoLinkAccount