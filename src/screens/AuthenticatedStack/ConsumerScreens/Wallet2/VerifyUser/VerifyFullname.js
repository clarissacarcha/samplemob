import React from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'

const VerifyFullname = ({fullname , setFullname , setCurrentIndex})=> {
    return (
        <>
        <View style={{flexDirection: "row",backgroundColor: "lightgray",paddingHorizontal: 20,paddingVertical: 18,}}>
                <View style={{flexBasis: "auto"}}>
                <Image style={{height: 40,width: 40, alignSelf: "center"}} source={require('../../../../../assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={{marginHorizontal: 10,}}>All your details are protected in accordance with our privacy policy</Text>
                </View>
        </View>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <Text style={{fontSize: 18, fontWeight: '400'}}>What's your full name?</Text>
                    <Text style={{color: 'gray',marginTop: 8,}}>Please enter the name that appears on your government ID</Text>
                    <TextInput 
                        style={styles.input}
                        value={fullname}
                        onChangeText={(value)=>setFullname(value)}
                    />
            </View>

            <View style={styles.proceedBtn}>
                <TouchableOpacity onPress={()=>{
                    if(fullname == "") return Alert.alert("Please provide Fullname")
                    setCurrentIndex(oldval => oldval + 1)
                }} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                    <Text style={{color: COLOR}}>Next</Text>
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
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
    }
})

export default VerifyFullname