import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'

//SELF IMPORTS
import ContentItem from './ContentItem'

const MoneyProtected = ()=> {

    return (
        <View style={styles.container}>
                <View style={styles.walletIcon}>
                    <Image style={{width: 180 ,height: 113}} resizeMode="stretch" source={require('../../../../../assets/images/SecurityAndPrivacy/money.png')}/>
                </View>
                <View style={styles.content}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Your Money is protected</Text>
                    <Text style={{fontFamily: FONT_LIGHT,fontSize: 14,marginTop: 5}}>Your wallet balance is stored and protected by a trusted partner bank</Text>
                    <View style={{marginTop: 20,paddingBottom: 20}}>
                            <ContentItem message="Your toktokwallet balance is held in a dedicated customer account" label="Separated for your security" icon={require('../../../../../assets/icons/magnifying.png')}/>
                            <ContentItem message="toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP)." label="Regulated by the local monetary authority" icon={require('../../../../../assets/icons/magnifying.png')}/>
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
    walletIcon: {
        justifyContent:"center",
        alignItems:"center"
    },
    content: {
        marginTop: 70,
    },
})

export default MoneyProtected