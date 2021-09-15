import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import AccountRecovery from "./AccountRecovery"

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

export const BlockedAccount = ({data})=> {
    const navigation = useNavigation()
    const { account } = data

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
                <View style={{alignItems:"center",marginTop: 10}}>
                    <Text style={[styles.verifyWalletText , {color: COLOR.ORANGE}]}>STOP!</Text>
                    <Text style={styles.clickVerifyText}>Your toktokwallet account has been blocked or put on-hold. To know more details, contact support@toktokwallet.ph and (02) 84-248-617.</Text>
                </View>

                {
                    account.disabledType == "2" && <AccountRecovery/>
                }
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Ok" onPress={()=> {
                    navigation.pop()
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
        padding: 10,
        paddingTop: 30,
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
    },
})
