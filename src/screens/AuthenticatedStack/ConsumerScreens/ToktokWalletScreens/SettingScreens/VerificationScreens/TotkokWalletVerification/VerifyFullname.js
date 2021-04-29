import React, {useContext} from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity,Linking} from 'react-native'
import {FONTS, SIZES, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import validator from 'validator';
import { BlackButton, YellowButton } from '../../../../../../../revamp'

const VerifyFullname = ()=> {

    const {fullname, setFullname, setCurrentIndex } = useContext(VerifyContext)

    const NextPage = ()=> {
        if (validator.isEmpty(fullname, {ignore_whitespace: true})) {
            return Alert.alert("","Full Name is required.")
         }
        setCurrentIndex(oldval => oldval + 1)
    }

    const ViewPrivacyPolicy = ()=> {
        return Linking.openURL("https://toktok.ph/privacy-policy")
    }

    return (
        <>
        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
                <View>
                <Image style={styles.policyIcon} source={require('../../../../../../../assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center",marginRight: 20,}}>
                    <Text style={{marginHorizontal: 10,fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>All your details are protected in accordance with our <Text style={{color: COLORS.YELLOW}}>privacy policy.</Text></Text>
                </View>
        </TouchableOpacity>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>What's your Full Name?</Text>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S}}>Please enter the name that appears on your government ID.</Text>
                    <TextInput 
                        style={styles.input}
                        value={fullname}
                        onChangeText={(value)=>setFullname(value)}
                        onSubmitEditing={NextPage}
                    />
            </View>

            <YellowButton label="Next" onPress={NextPage}/>
        </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    policyView: {
        flexDirection: "row",
        backgroundColor: "#F6F6F6",
        paddingHorizontal: 16,
        paddingVertical: 18,
    },  
    policyIcon: {
        height: 30,
        width: 30, 
        alignSelf: "center"
    },
    progressBar: {
        height: 2,
        width: "100%",
        flexDirection: "row",
    }, 
    progressBarItem: {
        flex: 1,
    },
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.M,
        paddingHorizontal: 10,
    }
})

export default VerifyFullname