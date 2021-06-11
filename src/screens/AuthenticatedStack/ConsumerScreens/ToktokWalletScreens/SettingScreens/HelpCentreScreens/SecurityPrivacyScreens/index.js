import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {YellowButton ,HeaderBack, HeaderTitle, } from '../../../../../../../revamp';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';
import {Separator} from '../../../Components'


const Card = (props) => {
    return (
        <>
            <Separator />    
                <TouchableOpacity onPress={props.onPress || null} style={{flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 18}}>
                    <View style={{flex: 3, justifyContent: 'center'}}>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>{props.title}</Text>
                        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>{props.content}</Text>
                    </View>
                    <View style={{flex: 1.5, flexDirection: 'row-reverse'}}>
                        <Image style={{margin: 8, resizeMode: 'contain', width: 80, height: 90}} source={props.imageSource}/>
                    </View>
                </TouchableOpacity>
        </>
    )
} 

const SecurityPrivacyScreen = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Security and privacy centre', '']} />,
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1}}>    
                <Card
                    title="Layered Security"
                    content="Multi-layered protection prevents intrusions, keeping your money and data safe."
                    imageSource={require('../../../../../../../assets/images/SecurityAndPrivacy/security.png')}
                    onPress={() => navigation.navigate("ToktokWalletHelpCentreLayeredSecurity")}
                />
                <Card
                    title="Your money is protected"
                    content="Your wallet balance is stored and protected with a trusted partner bank."
                    imageSource={require('../../../../../../../assets/images/SecurityAndPrivacy/money.png')}
                    onPress={() => navigation.navigate("ToktokWalletHelpCentreMoneyProtected")}
                />
                <Card
                    title="Help within reach"
                    content="Having issues? Contact us through here."
                    imageSource={require('../../../../../../../assets/images/SecurityAndPrivacy/HelpReach.png')}
                />
                <Separator />
            </View>
        </View>
        </>
    )
}

export default SecurityPrivacyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
