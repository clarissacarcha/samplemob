import React, { useState , useEffect , useCallback } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator, BuildingBottom } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import { moderateScale } from 'toktokwallet/helper'

//SELF IMPORTS
import AccountRecovery from "./AccountRecovery"

import CONSTANTS from 'common/res/constants';
const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS;

export const BlockedAccount = ({data,showPrompt})=> {
    const navigation = useNavigation()
    const { account } = data
    const [visible,setVisible] = useState(false)

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
                <View style={{marginTop: 10, paddingHorizontal: moderateScale(30)}}>
                    <Text style={[styles.verifyWalletText]}>Your account is deactivated</Text>
                    <Text style={styles.clickVerifyText}>Please contact our Customer Service Representative for support</Text>
                </View>
                <TouchableOpacity onPress={HelpCenter} style={styles.helpCenter}>
                    <Text style={styles.labelHC}>Help Center</Text>
                 </TouchableOpacity>
            </View>
            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="OK" onPress={()=> {
                    navigation.navigate("ToktokLandingHome")
                }}/>
            </View>
            <BuildingBottom/>
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
        paddingVertical: moderateScale(20),
        paddingTop: moderateScale(100),
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        marginTop: 10,
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
