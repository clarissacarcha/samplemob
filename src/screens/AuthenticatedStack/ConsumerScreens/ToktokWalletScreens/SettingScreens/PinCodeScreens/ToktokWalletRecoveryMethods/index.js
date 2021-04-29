import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { HeaderBackClose , HeaderTitle} from '../../../../../../../components'
import { COLOR, FONTS, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather'
import {useSelector} from 'react-redux'
import Separator from '../../../Components/Separator'

const RecoveryMethod = ({title,message,onPress})=> {
    return (
        <TouchableOpacity onPress={onPress} style={styles.recoveryMethod}>
          <View style={styles.recoveryMethodText}>
                <Text style={{fontFamily: FONTS.BOLD , fontSize: SIZES.M}}>{title}</Text>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S}}>{message}</Text>
          </View>
          <View style={{justifyContent:"center",alignItems:"center",flexBasis:"auto"}}>
                <FIcon name="chevron-right" size={18} color={"silver"} />
          </View>
        </TouchableOpacity>
    )
}

export default ({navigation})=> {

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

    const emailLeft = emails[0]
    const maskedchars = maskedchar(emailLeft.length - 1 )
    const email = `${emailLeft[0]}${maskedchars}@${emails[1]}`

    const recoverWallet = ()=> {
        return navigation.navigate("ToktokWalletRecoverPin")
    }


    return (
        <>
        <Separator />
        <View style={styles.container}>
            <RecoveryMethod title={"Registered Mobile No."} message={`Use your verified mobile no. ${session.user.username}`} onPress={recoverWallet}/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recoveryMethod: {
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor:"white",
        flexDirection:"row"
    },
    recoveryMethodText: {
        flex: 1,
    }
})
