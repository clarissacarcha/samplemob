import React , {useEffect,useState} from 'react'
import { View , Text, StyleSheet , Image , Linking , TouchableOpacity, TextInput } from 'react-native'
import {HeaderBack, HeaderTitle , YellowButton} from 'src/revamp'
import { BuildingBottom , Separator, CheckIdleState , DisabledButton } from 'toktokwallet/components'
import EmailLogo from 'toktokwallet/assets/images/contact-us/email.png'
import PhoneLogo from 'toktokwallet/assets/images/contact-us/phone.png'
import MessengerLogo from 'toktokwallet/assets/images/contact-us/messenger.png'
import {moderateScale } from 'toktokwallet/helper'
import {useThrottle} from 'src/hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT  } from 'src/graphql'
import {POST_SEND_MESSAGE  } from 'toktokwallet/graphql'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert , usePrompt } from 'src/hooks'
import { useMutation } from '@apollo/react-hooks'
import { AlertOverlay } from 'src/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW , SIZE } = CONSTANTS

const ItemList = ({logo,label , url , style})=> {

    const openUrl = ()=>{
        Linking.openURL(url);
    }

    return (
        <TouchableOpacity onPress={openUrl} style={[styles.itemList , style]}>
             <Image 
                style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    tintColor: "#F6841F"
                }} 
                resizeMode="contain"
                source={logo}
             />
             <Text style={{
                 fontFamily: FONT.REGULAR,
                 fontSize: moderateScale(FONT_SIZE.S),
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
        headerTitle: () => <HeaderTitle label={['Contact', 'Us']} />,
    });

    const [message,setMessage] = useState("")
    const alert = useAlert();
    const prompt = usePrompt();

    const [postSendMessage , {loading}] = useMutation(POST_SEND_MESSAGE, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert ,error}),
        onCompleted: ({postSendMessage})=>{
            setMessage("")
            prompt({
                type: "success",
                title: "Successful!",
                message: "Message successfully sent.",
                event: "TOKTOKWALLET"
            })
        }
    })

    const sendEmail = ()=> {
        if(message.length == 0) return;
        postSendMessage({
            variables: {
                input: {
                    message
                }
            }
        })
    }

    const onThrottledPress = useThrottle(sendEmail, 2000)

    return (
        <CheckIdleState>
        <AlertOverlay visible={loading}/>
        <Separator/>
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.content}>
                    {/* <Text style={styles.title}>Contact Us</Text> */}
                    <Text style={{
                        paddingHorizontal:15,
                        fontSize: FONT_SIZE.M,
                        fontFamily: FONT.REGULAR,
                        textAlign:"center"
                    }}>
                        toktokwallet team provides only the best service experience to our customers. Should you have  any questions and concerns, you may reach us through the following details:
                    </Text>
                </View>
                <View style={styles.contact}>
                    <ItemList url="tel:(623) 8424 8617" logo={PhoneLogo} label="(632) 8424 8617"/>
                    <ItemList style={{flex: 1,justifyContent:"flex-end"}} url="mailto:support@toktokwallet.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?" logo={EmailLogo} label="support@toktokwallet.ph"/>
                </View>
                <View style={styles.messageBox}>
                    <Text style={{ color: "#9E9E9E", fontFamily: FONT.BOLD }}>Message</Text>
                    <TextInput 
                        style={styles.messageInput}
                        value={message}
                        onChangeText={(value)=> {
                            setMessage(value)
                        }}
                        keyboardType="default"
                        returnKeyType="done"
                        multiline={true}
                        textAlignVertical='top'
                        blurOnSubmit={true}
                    />
                </View>
                <View style={styles.submitBtn}>
                       {
                           message.length > 0 
                           ? <YellowButton onPress={onThrottledPress} label="Submit"/>
                           : <DisabledButton label="Submit"/>
                       }
                </View>
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
        padding: 16,
    },
    body: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
        ...SHADOW,
        borderRadius: 10,
    },  
    content: {
        marginTop: 10,
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
        marginVertical: 5,
        backgroundColor:"white",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center"
    },
    contact: {
        flexDirection:"row",
        marginVertical: 15,
        alignItems: "center"
    },
    messageInput: {
        paddingHorizontal: 10,
        height: 200,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
    },
    submitBtn: {
        paddingVertical: moderateScale(20)
    }
})
