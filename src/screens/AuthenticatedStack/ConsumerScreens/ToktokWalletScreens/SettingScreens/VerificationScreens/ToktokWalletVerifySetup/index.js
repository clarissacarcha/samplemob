import React, { useRef , useEffect} from 'react'
import {StyleSheet,View,Text,ActivityIndicator,StatusBar} from 'react-native'
import {SIZES, COLORS, FONTS} from '../../../../../../../res/constants'
import { SomethingWentWrong} from '../../../../../../../components'
import {GET_TOKTOK_WALLET_KYC, GET_TOKTOK_WALLET} from '../../../../../../../graphql'
import {useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { YellowButton } from '../../../../../../../revamp'
import {HeaderImageBackground, HeadingBannerLogo, HeaderTitle, Separator} from '../../../Components'

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <YellowButton label="Verify Now" onPress={()=> {
            navigation.pop()
            navigation.navigate(route)
        }}/>
    )
}


const MainComponent = ({children , route})=> {
    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={[styles.container]}>
            {/* <HeadingBannerLogo /> */}
            <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <View style={{alignItems:"center"}}>
                        {children}
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                {
                    route && <ProceedButton route={route}/>
                }
            </View>
        
        </View>
        </>
    )
}

const ToktokWalletVerifySetup = ({navigation,route})=> {
    navigation.setOptions({
        // headerLeft: ()=> <HeaderBack />,
        // headerTitle: ()=> <HeaderTitle label={['',]}/>,
        headerShown: false,
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
            <ActivityIndicator size={24} color={COLORS.YELLOW} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    if(!data.getToktokWallet.record.toktokWalletKYC) {
        return (
            <MainComponent route="ToktokWalletVerification">
                 <Text style={styles.verifyWalletText}>Verify your <Text style={{color: COLORS.YELLOW}}>toktok</Text><Text style={{color: COLORS.ORANGE}}>wallet</Text></Text>
                 <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>

            <View style={{marginTop: 20}}>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Secure your account and payments</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Enjoy convenient payment experience</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Unlock toktokwallet features</Text>
            </View>
            </MainComponent>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 0){
        return (
            <>
            <MainComponent>
                    <Text style={styles.verifyWalletText}>Waiting for approval of <Text style={{color: COLORS.YELLOW}}>toktok</Text><Text style={{color: COLORS.ORANGE}}>wallet</Text></Text>
                    <Text style={styles.clickVerifyText}>toktokwallet verification is on pending.</Text>
            </MainComponent>
            <View style={{justifyContent:"flex-end",padding: 16,backgroundColor:"white"}}>
                <YellowButton label="Close" onPress={()=>navigation.pop()}/>
            </View>
            </>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 1){
        return (
            <>
            <MainComponent>
                <Text style={styles.verifyWalletText}>Your <Text style={{color: COLORS.YELLOW}}>toktok</Text><Text style={{color: COLORS.ORANGE}}>wallet</Text> is now verified</Text>
                <Text style={styles.clickVerifyText}>toktokwallet verification is approved.</Text>
            </MainComponent>
            <View style={{justifyContent:"flex-end",padding: 16,backgroundColor:"white"}}>
                <YellowButton label="Close" onPress={()=>navigation.pop()}/>
            </View>
          </>
        )
    }

    if(data.getToktokWallet.record.toktokWalletKYC.status == 2) {
        return (
            <MainComponent route="ToktokWalletVerification">
                <Text style={styles.verifyWalletText}>Verification of your <Text style={{color: COLORS.YELLOW}}>toktok</Text><Text style={{color: COLORS.ORANGE}}> wallet!</Text> Failed!</Text>
                <Text style={styles.clickVerifyText}>Click verify now to try again.</Text>
            </MainComponent>
        )
    }

   

    
}

const styles = StyleSheet.create({
    headings: {
        height: 92,
        backgroundColor:"black"
    },  
    walletLogo: {
        height: 160,
        width: 160,
        marginTop: 30,
        marginBottom: 20,
        alignSelf:"center"
    },
    verifyWalletText: {
        fontFamily: FONTS.BOLD,
        fontSize: 16,
    },
    clickVerifyText: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.S
    },
    listItem: {
        fontFamily: FONTS.REGULAR,
        marginBottom: 5,
        fontSize: SIZES.S
    },
    container: {
        flex: 1,
        // padding: 10,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        padding: 10,
        paddingTop: 30,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    }
})

export default ToktokWalletVerifySetup