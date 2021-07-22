import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,TextInput,ActivityIndicator,ImageBackground,Image} from 'react-native'
import { YellowButton, VectorIcon , ICON_SET  } from 'src/revamp'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CHECK_ACCOUNT , GET_LINK_ACCOUNT_OTP } from 'toktokwallet/graphql'
import { useQuery , useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlertlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")

const LoadingPage = ()=> {
    return (
        <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator/>
        </View>
    )
}

const BannerImages = ()=> (
    <View style={{marginTop: 20,justifyContent:'center'}}>
   
        <View style={{marginVertical: 10}}>
            <Image resizeMode="contain" style={{height: 200, width: 200}} source={require('toktokwallet/assets/images/tokwa_features.png')}/>
        </View>

        <View style={{flexDirection:'row',marginVertical: 10}}>
                <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
            </View>
            <View style={{justifyContent:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Secure</Text> your toktokwallet</Text>
            </View>
        </View>

        <View style={{flexDirection:'row',marginVertical: 10}}>
                <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
            </View>
            <View style={{justifyContent:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Enjoy</Text> convenient payment</Text>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>experience</Text>
            </View>
        </View>

        <View style={{flexDirection:'row',marginVertical: 10}}>
                <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
            </View>
            <View style={{justifyContent:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Unlock</Text> wallet features</Text>
            </View>
        </View>
</View>
)

const NoTokwaAccount = ({navigation})=> (
    <>
    <View style={styles.content}>
                <Text style={styles.verifyWalletText}>Create your toktokwallet account</Text>
                <Text style={styles.clickVerifyText}>Go to toktok customer app and use your toktok mobile number to create your toktokwallet account</Text>
                <BannerImages/>
    </View>

    <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
        <YellowButton label="Ok" onPress={()=>navigation.pop()}/>
    </View>
    </>
)


const RiderNoLinkAccount = ()=> {

    const alert = useAlert()
    const navigation = useNavigation()
    const session = useSelector(state=>state.session)

    const {data ,error ,loading} = useQuery(GET_CHECK_ACCOUNT, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        variables:{
            input: {
                //mobileNumber: '+639270752905',
                mobileNumber: session.user.username,
                motherReferenceNumber: session.user.id,
            }
        },
        onError: (error)=> {
            // onErrorAlert({alert,error})
        }
    })


    if(loading){
        return <LoadingPage/>
    }

    if(!data?.getCheckAccount){
        return <NoTokwaAccount navigation={navigation}/>
    }

    // const [getLinkAccountOTP] = useLazyQuery(GET_LINK_ACCOUNT_OTP, {
    //     fetchPolicy: "network-only",
    //     client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    //     onCompleted: ({getLinkAccountOTP})=> {
    //         // return navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: data.getCheckAccount})
    //     },
    //     onError: (error)=>{
    //         onErrorAlert({alert,error})
    //     }
    // })

    const getLinkAccountOTP = async (mobileNumber)=> {
        try {
            const result = await TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT.query({
                query: GET_LINK_ACCOUNT_OTP,
                fetchPolicy:"network-only",
                variables: {
                    input: {
                        mobileNumber: mobileNumber
                    }
                },
                errorPolicy:"all" 
            })
      
            if(result?.errors){
                return alert({message: result.errors[0].message})
            }
       
            if(result){
                return navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: data.getCheckAccount})
            }
        }catch(err){
            throw err
        }
    }

    return (
        <>
            <View style={styles.content}>
                <Text style={styles.verifyWalletText}>toktokwallet account {data.getCheckAccount.mobileNumber}</Text>
                <Text style={styles.clickVerifyText}>Click the "Link Now" button.</Text>
                <BannerImages/>
            </View>

            <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Link Now" onPress={()=>getLinkAccountOTP(data.getCheckAccount.mobileNumber)}/>
            </View>
    </>
    )
    
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 16,
        alignItems:"center"
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center',
        marginTop: 10,
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center',
        marginHorizontal: 10,
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