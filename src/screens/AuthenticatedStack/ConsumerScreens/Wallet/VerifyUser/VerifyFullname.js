import React, {useContext} from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_REGULAR, FONT_MEDIUM, FONT_LIGHT} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {VerifyContext} from './Context/VerifyContextProvider'
import validator from 'validator';

const VerifyFullname = ()=> {

    const {fullname, setFullname, setCurrentIndex } = useContext(VerifyContext)

    return (
        <>
        <View style={{flexDirection: "row",backgroundColor: "#F6F6F6",paddingHorizontal: 20,paddingVertical: 18,}}>
                <View style={{flexBasis: "auto"}}>
                <Image style={{height: 30,width: 30, alignSelf: "center"}} source={require('../../../../../assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center",marginRight: 10,}}>
                    <Text style={{marginHorizontal: 10,fontSize: 12,fontFamily: FONT_REGULAR}}>All your details are protected in accordance with our privacy policy</Text>
                </View>
        </View>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>What's your full name?</Text>
                    <Text style={{fontFamily: FONT_LIGHT,marginTop: 8,fontSize: 12}}>Please enter the name that appears on your government ID</Text>
                    <TextInput 
                        style={styles.input}
                        value={fullname}
                        onChangeText={(value)=>setFullname(value)}
                    />
            </View>

            <View style={styles.proceedBtn}>
                <TouchableOpacity onPress={()=>{
                    if (validator.isEmpty(fullname, {ignore_whitespace: true})) {
                        return Alert.alert("","Please provide Fullname")
                     }
                    setCurrentIndex(oldval => oldval + 1)
                }} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                    <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
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
        padding: 20,
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
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
        fontFamily: FONT_REGULAR
    }
})

export default VerifyFullname