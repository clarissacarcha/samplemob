import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { HeaderBackClose , HeaderTitle} from '../../../../../components'
import { COLOR, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather'
import {useSelector} from 'react-redux'

const RecoveryMethod = ({title,message,onPress})=> {
    return (
        <TouchableOpacity style={styles.recoveryMethod}>
          <View style={styles.recoveryMethodText}>
                <Text style={{fontFamily: FONT_MEDIUM}}>{title}</Text>
                <Text style={{fontFamily: FONT_LIGHT,fontSize: 12}}>{message}</Text>
          </View>
          <View style={{justifyContent:"center",alignItems:"center",flexBasis:"auto"}}>
                <FIcon name="chevron-right" size={18} color={"silver"} />
          </View>
        </TouchableOpacity>
    )
}

const ForgotPin = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Recovery Methods','']}/>,
    })

    const session = useSelector(state=>state.session)
    const emails = session.user.person.emailAddress.split("@")
    const maskedchar = (length)=> {
        let char = ""
        for(let x = 0 ; x < length ; x++){
            char = `${char}*`
        }
        return char
    }

    let emailLeft = emails[0]
    const maskedchars = maskedchar(emailLeft.length - 1 )
    let email = `${emailLeft[0]}${maskedchars}@${emails[1]}`


    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20,paddingVertical: 15}}>
                <Text style={{fontFamily: FONT_LIGHT, fontSize: 14}}>Authenticate yourself via</Text>
            </View>
            <RecoveryMethod title={"Email"} message={`Use your verified email address ${email}`}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recoveryMethod: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor:"white",
        flexDirection:"row"
    },
    recoveryMethodText: {
        flex: 1,
    }
})

export default ForgotPin