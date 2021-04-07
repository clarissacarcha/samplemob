import React from 'react'
import {View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native'
import {GET_TOKTOK_WALLET_KYC} from '../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, ORANGE } from '../../../../res/constants'
import { SomethingWentWrong } from '../../../../components'
import {useNavigation} from '@react-navigation/native';

const NotVerifiedComponent = ()=> {
 
    const session = useSelector(state=>state.session)
    const navigation = useNavigation()

    const {data,error,loading} = useQuery(GET_TOKTOK_WALLET_KYC,{
        fetchPolicy: 'network-only',
        variables: {
            input: {
                userId: session.user.id
            }
        }
    })


    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }


    if(!data.getToktokWallet.record.toktokWalletKYC) {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Go cashless with <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text></Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>Enjoy a secure and convenient payment experience.</Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>Account must be verified to process transactions.</Text>
                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletVerifyUserSetup")} style={{height: "100%",width: "100%",backgroundColor: "transparent", borderWidth: 1, borderColor: COLOR , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Verify Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 0){
        return (
            <View style={styles.container}>
                    <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Waiting for approval of <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text></Text>
                    <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>toktok wallet verification is on pending</Text>
                    {/* <Text>{JSON.stringify(data.getToktokWallet.record)}</Text> */}
            </View>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 2){
        return (
            <View style={styles.container}>
                  <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Verification of your <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet</Text> Failed!</Text>
                  <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>Click verify now to try again</Text>
                  <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletVerifyUserSetup")} style={{height: "100%",width: "100%",backgroundColor: DARK, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Verify Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: "center",
        // alignItems:"center"
    },
    proceedBtn: {
        height: 40,
        width: "100%",
        marginTop: 20,
    }
})

export default NotVerifiedComponent