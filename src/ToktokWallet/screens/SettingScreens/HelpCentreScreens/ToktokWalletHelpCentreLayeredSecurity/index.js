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
                        style={{right: props.title == "Data encryption" ? -2 : 0, resizeMode: props.resizeMode || 'contain', width: '100%', height: 35}}
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
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginVertical: 10}}>
                                toktokwallet has its multi-layered security features that prevent threats
                                intrusions, keeping your personal information and transaction details
                                safe and protected. 
                            </Text>
                            
                            <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>

                                {[
                                // {
                                //     title: "toktokwallet MPIN & TPIN authentication",
                                //     content: "We protect your wallet by offering toktokwallet MPIN & TPIN authentication. They help prevent unauthorized access to your account.",
                                //     imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/fingerprint.png'),
                                //     resizeMode: "stretch"
                                // },
                                {
                                    title: "Fraud prevention",
                                    content: "Your account and transaction are protected 24/7 by a fraud detection engine.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/fraud.png'),
                                    resizeMode: "contain"
                                }, {
                                    title: "OTP/TPIN for online transaction",
                                    content: "For safer and secure online transactions, toktokwallet integrates security features such as One-time Password (OTP) and Transaction PIN (TPIN) for validation and authentication to every e-money transaction.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/otp.png'),
                                    resizeMode: "contain"
                                },{
                                    title: "Instant payment alerts",
                                    content: "SMS, Push Notifications and Email are sent out as a receipt of confirmation for every online transaction.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/alerts.png'),
                                    resizeMode: "contain"
                                },{
                                    title: "Data encryption",
                                    content: "All data are secured and encrypted.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/encryption.png'),
                                    resizeMode: "contain"
                                },{
                                    title: "Data privacy",
                                    content: "Your personal information will not be shared or used for external gain.",
                                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/privacy.png'),
                                    resizeMode: "contain",
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