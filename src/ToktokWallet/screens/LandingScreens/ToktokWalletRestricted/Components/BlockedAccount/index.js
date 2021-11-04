import React, { useState , useEffect , useCallback } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import AccountRecovery from "./AccountRecovery"

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

export const BlockedAccount = ({data,showPrompt})=> {
    const navigation = useNavigation()
    const { account } = data
    const [visible,setVisible] = useState(false)

    navigation.setOptions({
        headerShown:false,
    })

    const HelpCenter = ()=> {
        setVisible(true)
    }

    useFocusEffect(useCallback(()=>{
        if(showPrompt) setVisible(true)
    },[showPrompt]))
  
    return (
        <>
        <AccountRecovery
            visible={visible}
            setVisible={setVisible}
            account={account}
        />
        <View style={styles.container}>
             <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <View style={{alignItems:"center",marginTop: 10}}>
                    <Text style={[styles.verifyWalletText , {color: COLOR.ORANGE}]}>Your account is deactivated</Text>
                    <Text style={styles.clickVerifyText}>Please contact our Customer Service Representative for support</Text>
                </View>

                <TouchableOpacity onPress={HelpCenter} style={styles.helpCenter}>
                    <Text style={styles.labelHC}>Help Center</Text>
                 </TouchableOpacity>
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
    helpCenter: {
        justifyContent:'center',
        alignItems:'center',
        marginVertical: 10,
        marginTop: 20
    },
    labelHC: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.L,
        color: COLOR.ORANGE,
        textDecorationLine:"underline"
    }
})
