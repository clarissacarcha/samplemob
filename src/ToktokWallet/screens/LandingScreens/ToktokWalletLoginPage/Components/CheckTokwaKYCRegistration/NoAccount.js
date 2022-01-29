import React , {useState} from 'react'
import {View,Text,StyleSheet, TouchableOpacity, StatusBar} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator  } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS 
import ModalLinkTokwaAccount from "./ModalLinkTokwaAccount";
import CustomerNoAccount from "./CustomerNoAccount";

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT , SIZE } = CONSTANTS

const NoAccount = ()=> {
    const navigation = useNavigation()
    const [showLinkModal, setShowLinkModal] = useState(false)

    navigation.setOptions({
        headerShown:false,
    })

    const LinkAccount = ()=> {
        setShowLinkModal(true)
    }

    return (
        <>
        <ModalLinkTokwaAccount visible={showLinkModal} setVisible={setShowLinkModal}/>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.container}>
             <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>

            <CustomerNoAccount/>
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
    linkButton: {
        width: "100%",
        height: SIZE.BUTTON_HEIGHT,
        backgroundColor:"#F7F7FA",
        marginBottom: 20,
        borderRadius: SIZE.BORDER_RADIUS,
        justifyContent:"center",
        alignItems:"center"
    },
    linkButtonLabel: {
        fontSize: FONT_SIZE.L,
        fontFamily: FONT.BOLD,
    }
})

export default NoAccount