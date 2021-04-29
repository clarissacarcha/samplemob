import React, {useContext} from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_REGULAR, FONT_MEDIUM, FONT_LIGHT, SIZES} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {VerifyContext} from './Context/VerifyContextProvider'
import validator from 'validator';
import { BlackButton } from '../../../../../revamp'

const VerifyFullname = ()=> {

    const {fullname, setFullname, setCurrentIndex } = useContext(VerifyContext)

    const NextPage = ()=> {
        if (validator.isEmpty(fullname, {ignore_whitespace: true})) {
            return Alert.alert("","Please provide full name")
         }
        setCurrentIndex(oldval => oldval + 1)
    }

    return (
        <>
        <View style={styles.policyView}>
                <View>
                <Image style={styles.policyIcon} source={require('../../../../../assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center",marginRight: 20,}}>
                    <Text style={{marginHorizontal: 10,fontSize: SIZES.S,fontFamily: FONT_REGULAR}}>All your details are protected in accordance with our privacy policy.</Text>
                </View>
        </View>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>What's your full name?</Text>
                    <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.S}}>Please enter the name that appears on your government ID.</Text>
                    <TextInput 
                        style={styles.input}
                        value={fullname}
                        onChangeText={(value)=>setFullname(value)}
                        onSubmitEditing={NextPage}
                    />
            </View>

            <BlackButton label="Next" onPress={NextPage}/>
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
        paddingHorizontal: 10,
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
        padding: 10,
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
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 5,
        fontFamily: FONT_REGULAR,
        fontSize: SIZES.M,
        paddingHorizontal: 10,
    }
})

export default VerifyFullname