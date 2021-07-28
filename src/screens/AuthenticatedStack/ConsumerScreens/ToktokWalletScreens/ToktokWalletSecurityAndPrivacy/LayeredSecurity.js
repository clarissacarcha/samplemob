import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'

//SELF IMPORTS
import ContentItem from './ContentItem'

const LayeredSecurity = ()=> {

    return (
        <View style={styles.container}>
                <View style={styles.mobileIcon}>
                    <Image source={require("../../../../../assets/images/SecurityAndPrivacy/security.png")} style={{position:"absolute", height:"100%",width:"100%",alignSelf:"center"}}/>
                </View>
                <View style={styles.content}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Layered Security</Text>
                    <Text style={{fontFamily: FONT_LIGHT,fontSize: 14,marginTop: 5}}>Multi-layed protection prevents intrusions, keeping your money and data safe.</Text>
                    <View style={{marginTop: 10,paddingBottom: 20}}>
                            <ContentItem message="We protect your wallet by offering toktokwallet PIN authentication. It prevents unauthorized access to your account." label="toktokwallet PIN" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="Your account and transactions are protected 24/7." label="Fraud prevention" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="Notifications are sent out after every toktokwallet payment. Keeping you aware of all your transactions." label="Instant payment alerts" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="Lorem Ipsum is simply dummy text of the printing and typesetting industry." label="Data encryption" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="Your personal information will not be shared or used for external gain." label="Data privacy" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="Lorem Ipsum is simply dummy text of the printing and typesetting industry." label="Data security" icon={require('../../../../../assets/icons/magnifying.png')}/>
                    </View>
                </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
    },
    mobileIcon: {
        justifyContent:"center",
        alignItems:"center",
        height: 140,
        width: 80,
        alignSelf:"center",
    },
    content: {
        marginTop: 25,
    },
})


export default LayeredSecurity