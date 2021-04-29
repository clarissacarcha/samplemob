import React, { useRef , useEffect} from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,ActivityIndicator,Animated} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR, SIZES} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import {GET_TOKTOK_WALLET_KYC, GET_TOKTOK_WALLET} from '../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { BlackButton } from '../../../../../revamp'

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <BlackButton label="Verify Now" onPress={()=> {
            navigation.pop()
            navigation.navigate(route)
        }}/>
    )
}


const MainComponent = ({children , route})=> {
    return (
        <View style={[styles.container]}>
            <View style={styles.content}>
                <Image style={styles.walletLogo} source={require('../../../../../assets/images/toktokwallet.png')} resizeMode="contain" />
                <View style={{alignItems:"center"}}>
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
            <MainComponent route="ToktokWalletVerifySetup">
                 <Text style={styles.verifyWalletText}>Verify your toktokwallet</Text>
                 <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>

            <View style={{marginTop: 20}}>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Secure your wallet</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Enjoy convenient payment experience</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Unlock wallet features</Text>
            </View>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 0){
        return (
            <MainComponent>
                <Text style={styles.verifyWalletText}>Waiting for approval of <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}>wallet!</Text></Text>
                <Text style={styles.clickVerifyText}>toktokwallet verification is on pending.</Text>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 1){
        return (
            <MainComponent>
                <Text style={styles.verifyWalletText}>Your <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}>wallet</Text> is now verified!</Text>
                <Text style={styles.clickVerifyText}>toktokwallet verification is approved.</Text>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 2) {
        return (
            <MainComponent route="ToktokWalletVerifySetup">
                <Text style={styles.verifyWalletText}>Verification of your <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}> wallet!</Text> Failed!</Text>
                <Text style={styles.clickVerifyText}>Click verify now to try again.</Text>
            </MainComponent>
        )
    }

   

    
}

const styles = StyleSheet.create({
    walletLogo: {
        height: 160,
        width: 160,
        marginTop: 30,
        marginBottom: 20,
        alignSelf:"center"
    },
    verifyWalletText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 20,
    },
    clickVerifyText: {
        fontFamily: FONT_REGULAR,
        fontSize: SIZES.M
    },
    listItem: {
        fontFamily: FONT_REGULAR,
        marginBottom: 1,
        fontSize: SIZES.M
    },
    container: {
        flex: 1,
        padding: 10,
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