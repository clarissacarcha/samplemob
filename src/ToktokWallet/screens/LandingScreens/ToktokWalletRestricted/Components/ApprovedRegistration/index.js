import React from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import {useSelector} from 'react-redux'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

export const ApprovedRegistration = ()=> {
    const navigation = useNavigation()

    const tokwaAccount = useSelector(state=>state.toktokWallet)

    navigation.setOptions({
        headerShown:false,
    })
    return (
        <>
        <View style={styles.container}>
             <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <Image style={{width: 225, height: 170}} source={require('toktokwallet/assets/images/welcome.png')}/>
                <View style={{alignItems:"center",marginTop: 20,}}>
                    <Text style={styles.verifyWalletText}>Welcome to <Text style={{ ...styles.verifyWalletText , color: COLOR.YELLOW}}>toktok</Text><Text style={{...styles.verifyWalletText, color: COLOR.ORANGE}}>wallet</Text> !</Text>
                    <Text style={[styles.clickVerifyText, {marginHorizontal: 10,}]}>Hi, Ka-toktok {tokwaAccount.person.firstName}! We are thrilled to announce that you are now a toktokwallet user! You can send money to your loved ones, cash in to any toktokwallet partner of your choice, and transfer funds. So easy!</Text>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Ok" onPress={()=> {
                     navigation.replace("ToktokWalletRestricted" , {component: "noMpin"})
                }}/>
            </View>
        
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        height: 92,
        backgroundColor:"black"
    },  
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        justifyContent:'center',
        alignItems:'center'
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
    },
})
