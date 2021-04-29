import React, { useState ,useRef } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Modal,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR} from '../../../../../res/constants'
import {useSelector} from 'react-redux'

const CreateConfirmEmail = ({patchPincodeToktokWallet})=> {


    const session = useSelector(state=>state.session)
    const [email,setEmail] = useState(session.user.person.emailAddress)

    return (
       <View style={styles.container}>
            <View style={styles.content}>
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,}}>Confirm your email address</Text>
                <View style={{alignSelf: "flex-start",width: "100%",marginTop: 20,}}>
                    <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>Email Address</Text>    
                    <TextInput 
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        editable={false}
                    /> 
                    <Text style={{fontSize: 12,fontFamily: FONT_REGULAR}}>This email address will be used to regain access to toktokwallet if you experience issues logging in.</Text>
                </View>
            </View>
 
            <TouchableOpacity
                onPress={patchPincodeToktokWallet}
                style={{alignItems: "center",height: 40,backgroundColor: DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Submit</Text>
            </TouchableOpacity>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        alignItems: "center",
        padding: 20,
        flex: 1,
    },
    input: {
        borderWidth: 0.5,
        borderColor: "silver",
        padding: 5,
        marginVertical:10,
        borderRadius: 5,
        fontSize: 12,
        fontFamily: FONT_REGULAR,
        color:"dimgray"
    },
})

export default CreateConfirmEmail