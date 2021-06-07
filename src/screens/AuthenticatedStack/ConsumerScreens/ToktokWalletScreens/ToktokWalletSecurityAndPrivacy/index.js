import React , {useState} from 'react'
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity} from 'react-native'
import { HeaderBack , HeaderTitle} from '../../../../../components'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

//SELF IMPORTS
import SecurityModal from './SecurityModal'

const SecurityItem = ({label, message , icon , onPress})=> {
    return (
        <TouchableOpacity onPress={onPress} style={styles.securityItem}>
                <View style={styles.securityItemContent}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize:14}}>{label}</Text>
                        <Text style={{fontFamily: FONT_LIGHT,fontSize: 12}}>{message}</Text>
                </View>
                <View style={styles.securityItemIcon}>
                        <Image source={icon.image} resizeMode="contain" style={[{height: icon.height , width: icon.width}]} />
                </View>
        </TouchableOpacity>
    )
}

const LearnMoreItem = ({icon , label , message, onPress})=> {
    return (
        <TouchableOpacity onPress={onPress} style={styles.learnMoreItem}>
                <View style={styles.learnMoreItemIcon}>
                    <Image style={{height: 19,width: 19}} source={icon} />
                </View>
                <View style={styles.learnMoreItemContent}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>{label}</Text>
                    <Text style={{fontFamily: FONT_LIGHT,fontSize: 12}}>{message}</Text>
                </View>
                <View style={styles.learnMoreItemProceed}>
                        <FIcon5 name="chevron-right" color="rgba(33, 37, 41, 0.4)"/>
                </View>
        </TouchableOpacity>
    )
}

const ToktokWalletSecurityAndPrivacy = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Security and privacy centre','']}/>,
    })

    const [visible, setVisible] = useState(false)
    const [index,setIndex] = useState(0)

    const onPress = (index)=> {
        setIndex(index)
        setVisible(true)
    }

    return (
        <>
        <SecurityModal visible={visible} setVisible={setVisible} index={index}/>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.security}>
                        <SecurityItem 
                            label="Layered Security" 
                            message="Multi-layered protection prevents intrusions, keeping your money and data safe." 
                            icon={{height: 67, width: 87,image: require("../../../../../assets/images/SecurityAndPrivacy/security_.png")}}
                            onPress={()=>onPress(0)}
                        />
                        <SecurityItem 
                            label="Your money is protected" 
                            message="Your wallet balance is stored and protected with a trusted partner bank."  
                            icon={{height: 39, width: 51,image: require("../../../../../assets/images/SecurityAndPrivacy/money.png")}}
                            onPress={()=>onPress(1)}
                        />
                        <SecurityItem 
                            label="Help within reach" 
                            message="Having issues? Here's how you can get in touch."  
                            icon={{height: 54, width: 85, image: require("../../../../../assets/images/SecurityAndPrivacy/HelpReach.png")}}
                            onPress={()=>onPress(2)}
                        />
                </View>

                <View style={styles.learnMore}>
                    <Text style={{fontFamily: FONT_MEDIUM , fontSize: 16,marginLeft: 20}}>Learn More</Text>
                    <LearnMoreItem message="Find out how you can protect your account" label="Read our security Blog" icon={require('../../../../../assets/icons/pen.png')}/>
                    <LearnMoreItem message="Visit our Help Centre for answers" label="Have a question?" icon={require('../../../../../assets/icons/question.png')}/>
                </View>
        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    security: {
        flex:1
    },
    securityItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection:"row"
    },
    securityItemContent: {
        flex: 1,
    },
    securityItemIcon: {
        width: 90,
        justifyContent:"center",
        alignItems:"flex-end"
    },
    learnMore: {
        flex: 1,
        marginTop: 40,
        marginBottom: 40
    },
    learnMoreItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection:"row"
    },
    learnMoreItemContent: {
        flex: 1,
    },
    learnMoreItemIcon: {
        width: 35,
        justifyContent:"center",
        alignItems:"flex-start"
    },
    learnMoreItemProceed: {
        width: 10,
        justifyContent:"center",
        alignItems: "flex-end"
    }
})

export default ToktokWalletSecurityAndPrivacy