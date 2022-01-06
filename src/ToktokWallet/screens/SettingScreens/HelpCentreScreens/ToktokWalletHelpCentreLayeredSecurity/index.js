import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, ScrollView} from 'react-native'
import {Separator,CheckIdleState} from 'toktokwallet/components'
import {HeaderBack, HeaderTitle} from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const ListItem = (props) => {
    return (
        <>
            <View style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
                <View style={{flex: 0.5, justifyContent: 'center', alignItems: "flex-start"}}>
                    <Image 
                        style={{resizeMode: props.resizeMode || 'contain', width: '100%', height: 35}}
                        source={props.imageSource ? props.imageSource : require('toktokwallet/assets/icons/magnifying.png')}
                    />
                </View>
                <View style={{flex: 4, paddingHorizontal: 18}}>
                    <Text style={styles.textTitle}>{props.title}</Text>
                    <Text style={styles.textContent}>{props.content}</Text>
                </View>                                    
            </View>
        </>
    )
}

export const ToktokWalletHelpCentreLayeredSecurity = ({navigation}) => {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Layered Security', '']} />,
    });

    return (
        <CheckIdleState>
            <View style={styles.container}>
                <Separator />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, backgroundColor: COLOR.WHITE}}>
                        
                        {/* <View style={{flex: 1, width: '100%', paddingVertical: 15, marginBottom: 8}}>
                            <Image 
                                style={{resizeMode: 'contain', width: '100%', height: 120}}
                                source={require('toktokwallet/assets/images/SecurityAndPrivacy/security.png')}
                            />
                        </View> */}

                        <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8}}>
                            
                            {/* <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Layered Security</Text> */}
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Multi-layered protection prevents intrusions, keeping your money and data safe.</Text>
                            
                            <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>

                                {[{
                                    title: "toktokwallet MPIN & TPIN authentication",
                                    content: "We protect your wallet by offering toktokwallet MPIN & TPIN authentication. They help prevent unauthorized access to your account.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/fingerprint.png'),
                                    resizeMode: "stretch"
                                },{
                                    title: "Fraud prevention",
                                    content: "Your account and transaction are protected 24/7 by a fraud detection engine.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/fraud.png'),
                                    resizeMode: "stretch"
                                }, {
                                    title: "OTP for online transaction",
                                    content: "Every online toktokwallet transaction is 3d Secure enabled and authenticated with an OTP.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/otp.png'),
                                    resizeMode: "stretch"
                                },{
                                    title: "Instant payment alerts",
                                    content: "Push notifications are sent out after every toktokwallet payment, keeping you aware of all your transactions.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/alerts.png'),
                                    resizeMode: "stretch"
                                },{
                                    title: "Data encryption",
                                    content: "Additional security for every transactions.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/encryption.png'),
                                    resizeMode: "stretch"
                                },{
                                    title: "Data privacy",
                                    content: "Your personal information will not be shared or used for external gain.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/privacy.png'),
                                    resizeMode: "stretch",
                                }].map((data, i) => <ListItem 
                                                        title={data.title} 
                                                        content={data.content} 
                                                        imageSource={data.imageSource}
                                                        resizeMode={data.resizeMode}
                                                    />
                                )}

                            </View>

                        </View>

                    </View>
                </ScrollView>
                
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    textTitle: {
        fontFamily: FONT.REGULAR, fontWeight: 'bold', fontSize: 12.5
    },
    textContent: {
        fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S
    }
})