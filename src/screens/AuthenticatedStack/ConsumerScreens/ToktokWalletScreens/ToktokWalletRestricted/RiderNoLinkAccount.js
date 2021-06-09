import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,TextInput,ActivityIndicator} from 'react-native'
import { YellowButton, VectorIcon , ICON_SET  } from '../../../../../revamp'
import { COLOR , FONT_SIZE , FONT , SIZE } from '../../../../../res/variables'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_CHECK_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useQuery } from '@apollo/react-hooks'
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

const NoTokwaAccount = ({navigation})=> (
    <>
    <View style={styles.content}>
         <Text>NO TOKWA ACCOUNT , PLEASE REGISTER USING TOKTOK CUSTOMER APP</Text>
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

    const linkAccount = ()=> {
        return navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: data.getCheckAccount})
    }


    if(loading){
        return <LoadingPage/>
    }

    if(!data?.getCheckAccount){
        return <NoTokwaAccount navigation={navigation}/>
    }


    return (
        <>
            <View style={styles.content}>
                <Text>LINK YOUR ACCOUNT NOW</Text>
            </View>

            <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Link Now" onPress={linkAccount}/>
            </View>
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