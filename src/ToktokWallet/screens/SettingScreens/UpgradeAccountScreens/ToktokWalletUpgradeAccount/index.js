import React , {useEffect,useState} from 'react'
import {View , Text , StyleSheet , TouchableOpacity ,Image} from 'react-native'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp'
import { Separator , CheckIdleState } from 'toktokwallet/components'
import imageLogo from 'toktokwallet/assets/images/AccountUpgrade/Tokwa.png'
import {verticalScale} from 'toktokwallet/helper'
import {useAccount} from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

const UpgradeRequirement = ({label})=> {
    return (
        <View style={styles.requirement}>
            <Text style={[styles.requirementText, {marginRight: 5,color: COLOR.YELLOW,alignSelf:"center",fontSize: FONT_SIZE.XS}]}>{'\u2B24'}</Text>
            <Text style={styles.requirementText}>{label}</Text>
        </View>
    )
}

export const ToktokWalletUpgradeAccount = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Upgrade Account','']}/>,
    })
    
    const { tokwaAccount, getMyAccount } = useAccount()

    useEffect(() => {
        getMyAccount()
    }, [])

    const upgradeAccount = ()=> {
        if(tokwaAccount.person.accountType.level == 1){
            // navigate to fully verified application
            return navigation.navigate("ToktokWalletFullyVerifiedApplication")
        }
        
        // console.log(tokwaAccount.isLinked)
        return navigation.navigate("ToktokWalletEnterpriseApplication")
    }   
    
    return (
        <CheckIdleState>
            <Separator/>
            <View style={styles.container}>
                <View style={styles.imageDiv}>
                    <Image style={styles.image} source={imageLogo} />
                    <Text style={styles.upgradeText}>Upgrade your 
                        <Text style={[styles.upgradeText, {color: COLOR.YELLOW}]}> toktok</Text>
                        <Text style={{...styles.upgradeText,color: COLOR.ORANGE}}>wallet</Text>
                    </Text>
                    <Text style={styles.clickText}>Click the "Upgrade Now" button.</Text>
                </View>
                <Separator/>
                <View style={styles.accountVerification}>
                    <Text style={styles.verifiedText}>Fully Verified</Text>
                    <UpgradeRequirement label="Link bank account"/>
                    <UpgradeRequirement label="Video call verification"/>
                </View>
                <Separator/>
                <View style={styles.accountVerification}>
                    <Text style={styles.verifiedText}>Enterprise</Text>
                    <UpgradeRequirement label="Business permit"/>
                    <UpgradeRequirement label="DTI certification of registration or SEC"/>
                    <UpgradeRequirement label="BIR 2303 form"/>
                    <UpgradeRequirement label="Barangay permit"/>
                    <UpgradeRequirement label="2 valid government ID"/>
                </View>
                <View style={styles.proceedBtn}>
                    <YellowButton label="Upgrade Now" onPress={upgradeAccount}/>
                </View>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    imageDiv: {
        height: verticalScale(230),
        justifyContent:"center",
        alignItems:"center"
    },
    image: {
        height: verticalScale(160),
        width: verticalScale(200)
    },
    upgradeText: {
        marginVertical: 5,
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.L
    },
    clickText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S
    },
    accountVerification: {
        padding: 16,
    }, 
    verifiedText: {
        fontFamily: FONT.BOLD,
        marginBottom: 5,
    },
    requirement: {
        flexDirection:"row",
    }, 
    requirementText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        marginVertical: 2,
        color: COLOR.DARK
    },
    proceedBtn: {
        flex: 1,
        padding: 16,
        justifyContent:"flex-end"
    },  
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})