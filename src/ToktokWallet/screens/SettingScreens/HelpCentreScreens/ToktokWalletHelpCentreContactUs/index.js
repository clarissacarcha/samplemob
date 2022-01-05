import React from 'react'
import { View , Text, StyleSheet , Image , Linking , TouchableOpacity } from 'react-native'
import {HeaderBack, HeaderTitle} from 'src/revamp'
import { BuildingBottom , Separator, CheckIdleState } from 'toktokwallet/components'
import EmailLogo from 'toktokwallet/assets/images/contact-us/email.png'
import PhoneLogo from 'toktokwallet/assets/images/contact-us/phone.png'
import MessengerLogo from 'toktokwallet/assets/images/contact-us/messenger.png'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW } = CONSTANTS

const ItemList = ({logo,label , url})=> {

    const openUrl = ()=>{
        Linking.openURL(url);
    }

    return (
        <TouchableOpacity onPress={openUrl} style={styles.itemList}>
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
        </TouchableOpacity>
    )
}

export const ToktokWalletHelpCentreContactUs = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['', '']} />,
    });

    return (
        <CheckIdleState>
        <Separator/>
        <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Contact Us</Text>
                    <Text style={{
                        paddingHorizontal:15,
                        fontSize: FONT_SIZE.M,
                        fontFamily: FONT.REGULAR,
                    }}>
                        Email or contact us with any of your inquiries. We will gladly discuss with you the best possible solution to your needs.
                    </Text>
                </View>
                <View style={{marginTop:30}}>
                    <ItemList url="mailto:support@toktokwallet.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?" logo={EmailLogo} label="support@toktokwallet.ph"/>
                    <ItemList url="tel:(623) 8424 8617" logo={PhoneLogo} label="(632) 84248617"/>
                    <ItemList url="https://www.facebook.com/toktokcsr.ph" logo={MessengerLogo} label="https://www.facebook.com/toktokcsr.ph"/>
                </View>
        <BuildingBottom/>
        </View>
        </CheckIdleState>
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
        backgroundColor:"white",
        padding: 10,
        borderRadius: 5,
       ...SHADOW
        
    }
})