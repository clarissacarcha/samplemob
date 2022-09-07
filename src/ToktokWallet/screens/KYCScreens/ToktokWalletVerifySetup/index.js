import React from 'react'
import {StyleSheet,View,Text,StatusBar} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { YellowButton } from 'src/revamp'
import {HeaderImageBackground, HeaderTitle, Separator} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

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

export const ToktokWalletVerifySetup = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false,
    })

    const walletinfo = route.params.walletinfo

    if(!walletinfo.toktokWalletKYC) {
        return (
            <MainComponent route="ToktokWalletVerification">
                 <Text style={styles.verifyWalletText}>Verify your <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}>wallet</Text></Text>
                 <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>

            <View style={{marginTop: 20}}>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Secure your account and payments</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Enjoy convenient payment experience</Text>
                <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Unlock toktokwallet features</Text>
            </View>
            </MainComponent>
        )
    }

    if(walletinfo.toktokWalletKYC.status == 0){
        return (
            <>
            <MainComponent>
                    <Text style={styles.verifyWalletText}>Waiting for approval of <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}>wallet</Text></Text>
                    <Text style={styles.clickVerifyText}>toktokwallet verification is on pending.</Text>
            </MainComponent>
            <View style={{justifyContent:"flex-end",padding: 16,backgroundColor:"white"}}>
                <YellowButton label="Close" onPress={()=>navigation.pop()}/>
            </View>
            </>
        )
    }

    if(walletinfo.toktokWalletKYC.status == 1){
        return (
            <>
            <MainComponent>
                <Text style={styles.verifyWalletText}>Your <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}>wallet</Text> is now verified</Text>
                <Text style={styles.clickVerifyText}>toktokwallet verification is approved.</Text>
            </MainComponent>
            <View style={{justifyContent:"flex-end",padding: 16,backgroundColor:"white"}}>
                <YellowButton label="Close" onPress={()=>navigation.pop()}/>
            </View>
          </>
        )
    }

    if(walletinfo.toktokWalletKYC.status == 2) {
        return (
            <MainComponent route="ToktokWalletVerification">
                <Text style={styles.verifyWalletText}>Verification of your <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}> wallet!</Text> Failed!</Text>
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
        fontFamily: FONT.BOLD,
        fontSize: 16,
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
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
