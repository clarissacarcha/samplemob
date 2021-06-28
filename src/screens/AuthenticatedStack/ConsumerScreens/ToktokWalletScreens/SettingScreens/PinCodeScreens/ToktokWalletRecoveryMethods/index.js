import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { HeaderBackClose} from '../../../../../../../components'
import { COLORS, FONTS, SIZES } from '../../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather'
import {useSelector} from 'react-redux'
import {Separator} from '../../../Components'
import { HeaderBack , HeaderTitle} from '../../../../../../../revamp'
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE , VERIFY_FORGOT_AND_RECOVER_OTP_CODE} from '../../../../../../../graphql/toktokwallet'
import { onError, onErrorAlert } from '../../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../../hooks'

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

const ToktokWalletRecoveryMethods = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Recovery','']}/>,
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
    const alert = useAlert()

    const recoverWallet = ()=> {
        getForgotAndRecoverOTPCode()
        // return navigation.navigate("ToktokWalletRecoverPin")
    }

    const [getForgotAndRecoverOTPCode] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getForgotAndRecoverOTPCode})=>{
            return navigation.navigate("ToktokWalletRecoverPin")
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })


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

export default ToktokWalletRecoveryMethods