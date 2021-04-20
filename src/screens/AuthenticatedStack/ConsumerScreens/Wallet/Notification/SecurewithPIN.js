import React from 'react'
import {View,Text,TouchableOpacity,StyleSheet,Modal,Dimensions} from 'react-native'
import { COLOR, DARK, FONT_REGULAR } from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'

const {width,height} = Dimensions.get("window")

const ActionButton = ({onPress,label, textStyle, btnStyle})=> {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.actionBtn,{...btnStyle}]}>
                <Text style={[{...textStyle},{fontFamily: FONT_REGULAR,fontSize: 12}]}>{label}</Text>
        </TouchableOpacity>
    )
}


const SecurewithPIN = ({isVisible,setIsVisible,walletinfo})=> {

    const navigation = useNavigation()

    const setUpPIN = ()=> {
        setIsVisible(false)
        return navigation.navigate("TokTokWalletSettingsPinCode",{walletinfo})
    }

    return (
        <Modal
            style={styles.container}
            transparent={true}
            visible={isVisible}
            onRequestClose={()=>setIsVisible(false)}
        >

            <View style={styles.content}>
                <View style={styles.body}>


                <Text>SECURE YOUR WALLET</Text>


                    <View style={styles.actionButtons}>
                        
                        <ActionButton onPress={()=>setIsVisible(false)} label={'Do it later'} textStyle={{ color: "gray",}} btnStyle={{ borderColor: "gray",borderWidth: 1,}}/>
                        <ActionButton onPress={setUpPIN} label={'Set up PIN'} textStyle={{color: COLOR,}} btnStyle={{backgroundColor: DARK,}}/>

                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex:1,
        backgroundColor:"rgba(0,0,0,0.5)",
        justifyContent:"center",
        alignItems:"center",
    },
    body: {
        width: width * 0.8,
        paddingVertical: 20,
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent:"flex-start",
        alignItems:"center",
        paddingRight: 15,
    },
    actionButtons: {
        flexDirection:"row",
        paddingHorizontal: 10,
        paddingBottom:10,
        marginTop: 15,
    },
    actionBtn: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent:"center",
        alignItems:"center",
        height: 35,
        borderRadius: 10
    }
})

export default SecurewithPIN