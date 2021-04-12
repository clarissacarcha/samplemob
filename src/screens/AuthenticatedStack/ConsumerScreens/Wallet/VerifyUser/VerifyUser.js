import React, { useRef , useEffect} from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,ActivityIndicator,Animated} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import {GET_TOKTOK_WALLET_KYC, GET_TOKTOK_WALLET} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <View style={styles.proceedBtn}>
                 <TouchableOpacity onPress={()=>navigation.navigate(route)} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                    <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Verify Now</Text>
                </TouchableOpacity>
        </View>
    )
}


const MainComponent = ({children , route})=> {
    return (
        <View style={[styles.container]}>
            <View style={styles.content}>
                <Image style={{height: 120, width: 120, alignSelf: "center",marginVertical: 30}} source={require('../../../../../assets/images/toktokwallet.png')} resizeMode="contain" />
                <View style={{marginTop: 50,alignItems:"center"}}>
                        {children}
                </View>
            </View>
        
            {
                route && <ProceedButton route={route}/>
            }
        
        </View>
    )
}

const VerifyUser = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['',]}/>,
    })

    const session = useSelector(state=>state.session)

    const {data,error,loading} = useQuery(GET_TOKTOK_WALLET,{
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
            <MainComponent route="TokTokWalletVerifyUserSetup">
                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Go cashless with <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text></Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>Enjoy a secure and convenient payment experience</Text>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 0){
        return (
            <MainComponent>
                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Waiting for approval of <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text></Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>toktok wallet verification is on pending</Text>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 1){
        return (
            <MainComponent>
                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Your <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet</Text> is now verified!</Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>toktok wallet verification is approved</Text>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 2) {
        return (
            <MainComponent route="TokTokWalletVerifyUserSetup">
                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM}}>Verification of your <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text> Failed!</Text>
                <Text style={{fontSize: 14,marginTop: 5,fontFamily: FONT_REGULAR}}>Click verify now to try again</Text>
            </MainComponent>
        )
    }

   

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    }
})

export default VerifyUser