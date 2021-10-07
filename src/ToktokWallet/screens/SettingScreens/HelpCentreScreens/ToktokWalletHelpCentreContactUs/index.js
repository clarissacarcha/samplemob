import React from 'react'
import { View , Text, StyleSheet , Image } from 'react-native'
import {HeaderBack, HeaderTitle} from 'src/revamp'
import { BuildingBottom , Separator } from 'toktokwallet/components'
import EmailLogo from 'toktokwallet/assets/images/contact-us/email.png'
import PhoneLogo from 'toktokwallet/assets/images/contact-us/phone.png'
import MessengerLogo from 'toktokwallet/assets/images/contact-us/messenger.png'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const ItemList = ({logo,label})=> {
    return (
        <View style={styles.itemList}>
             <Image 
                style={{
                    height: 25,
                    width: 25,
                }} 
                resizeMode="contain"
                source={logo}
             />
             <Text style={{
                 fontFamily: FONT.REGULAR,
                 fontSize: FONT_SIZE.M,
                 marginLeft: 10,
             }}>
                 {label}
            </Text>
        </View>
    )
}

export const ToktokWalletHelpCentreContactUs = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['', '']} />,
    });

    return (
        <>
        <Separator/>
        <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Contact Us</Text>
                    <Text style={{
                        paddingHorizontal:15,
                        fontSize: FONT_SIZE.M,
                        fontFamily: FONT.REGULAR,
                    }}>Email us with any of your inquiries or contact us with
                    the contact information provided below. We will gladly
                    discuss with you the best possible solution
                    to your needs.</Text>
                </View>
                <View style={{marginTop:30}}>
                    <ItemList logo={EmailLogo} label="support@toktokwallet.ph"/>
                    <ItemList logo={PhoneLogo} label="(632) 84248617"/>
                    <ItemList logo={MessengerLogo} label="https://www.facebook.com/toktokcsr.ph"/>
                </View>
        <BuildingBottom/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16
    },
    content: {
        marginTop: 50,
        alignItems:"center"
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.XL + 5,
        color: COLOR.ORANGE,
        marginBottom: 10
    },
    itemList: {
        flexDirection:"row",
        justifyContent:"center",
        marginVertical: 5,
    }
})