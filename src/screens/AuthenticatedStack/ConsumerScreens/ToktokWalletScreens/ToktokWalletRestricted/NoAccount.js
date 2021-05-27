import React , {useState} from 'react'
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator  } from '../Components'
import { COLOR , FONT_SIZE , FONT , SIZE } from '../../../../../res/variables'
import { YellowButton , VectorIcon , ICON_SET } from '../../../../../revamp'

//SELF IMPORTS 
import ModalLinkTokwaAccount from "./ModalLinkTokwaAccount";

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <YellowButton label="Verify Now" onPress={()=> {
            navigation.pop()
            navigation.navigate(route)
        }}/>
    )
}

const LinkButton = ({onPress})=> {
    const navigation = useNavigation()
   
    return (
        <TouchableOpacity onPress={onPress} style={styles.linkButton}>
                <Text style={styles.linkButtonLabel}>Link</Text>
        </TouchableOpacity>
    )
}


const PendingKyc = ()=> {
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
        <View style={styles.container}>
             <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <View style={{alignItems:"center"}}>
                    <Text style={styles.verifyWalletText}>Verify your <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}>wallet</Text></Text>
                    <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>
                    <View style={{marginTop: 20}}>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Create your toktokwallet</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Secure your account and payments</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Enjoy convenient payment experience</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Unlock toktokwallet features</Text>
                    </View>
                </View>
            </View>

            <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
               <LinkButton onPress={LinkAccount}/>
               <ProceedButton route="ToktokWalletVerification" />
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

export default PendingKyc