import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, ScrollView} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../../res/variables';
import { COLORS, FONTS, FONT_BOLD } from '../../../../../../../../res/constants';
import {Separator} from '../../../../Components'

const ListItem = (props) => {
    return (
        <>
            <View style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
                <View style={{flex: 0.5, justifyContent: 'center', alignItems: "flex-start"}}>
                    <Image 
                        style={{resizeMode: props.resizeMode || 'contain', width: '100%', height: 35}}
                        source={props.imageSource ? props.imageSource : require('../../../../../../../../assets/icons/magnifying.png')}
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

const LayeredSecurity = ({navigation}) => {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Layered Security', '']} />,
    });

    return (
        <>
            <View style={styles.container}>
                <Separator />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
                        
                        <View style={{flex: 1, width: '100%', paddingVertical: 15, marginBottom: 8}}>
                            <Image 
                                style={{resizeMode: 'contain', width: '100%', height: 120}}
                                source={require('../../../../../../../../assets/images/SecurityAndPrivacy/security.png')}
                            />
                        </View>

                        <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8}}>
                            
                            <Text style={{fontFamily: FONTS.BOLD, fontSize: FONT_SIZE.M}}>Layered Security</Text>
                            <Text style={{fontFamily: FONTS.REGULAR, fontSize: FONT_SIZE.S}}>Multi-layered protection prevents intrusions, keeping your money and data safe.</Text>
                            
                            <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>

                                <ListItem
                                    title="toktok PIN and biometric authentication"
                                    content="We protect your wallet by offering toktok PIN biometric authentication. They help prevent unauthorized access to your account."
                                    imageSource={require('../../../../../../../../assets/images/SecurityAndPrivacy/fingerprint.png')}
                                    resizeMode="stretch"
                                />
                                
                                {[{
                                    title: "Fraud prevention",
                                    content: "Your account and transaction are protected 24/7 by a fraud detection engine"
                                }, {
                                    title: "OTP for online transaction",
                                    content: "Every online toktokwallet transaction is 3d Secure enabled and authenticated with an OTP."
                                },{
                                    title: "Instant payment alerts",
                                    content: "Push notifications are sent out after every toktokwallet payment, keeping you aware of all your transactions."
                                },{
                                    title: "Data encryption",
                                    content: "Push notifications are sent out after every toktokwallet payment, keeping you aware of all your transactions."
                                },{
                                    title: "Data privacy",
                                    content: "Your personal information will not be shared or used for external gain."
                                }].map((data, i) => <ListItem title={data.title} content={data.content} />)}

                            </View>

                        </View>

                    </View>
                </ScrollView>
                
            </View>
        </>
    )
}

export default LayeredSecurity


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    textTitle: {
        fontFamily: FONTS.REGULAR, fontWeight: 'bold', fontSize: 12.5
    },
    textContent: {
        fontFamily: FONTS.REGULAR, fontSize: FONT_SIZE.S
    }
})