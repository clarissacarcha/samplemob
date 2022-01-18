import React , {useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import FIcon from 'react-native-vector-icons/Feather'
import {useSelector} from 'react-redux'
import {Separator,CheckIdleState} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle} from 'src/revamp'
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE , VERIFY_FORGOT_AND_RECOVER_OTP_CODE} from 'toktokwallet/graphql'
import { onError, onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert, usePrompt} from 'src/hooks'
import { useAccount } from 'toktokwallet/hooks'
import { AlertOverlay } from 'src/components'
import CONSTANTS from 'common/res/constants'
import { TransactionUtility } from 'toktokwallet/util'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const RecoveryMethod = ({title,message,onPress})=> {
    return (
        <TouchableOpacity onPress={onPress} style={styles.recoveryMethod}>
          <View style={styles.recoveryMethodText}>
                <Text style={{fontFamily: FONT.BOLD , fontSize: FONT_SIZE.M}}>{title}</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S}}>{message}</Text>
          </View>
          <View style={{justifyContent:"center",alignItems:"center",flexBasis:"auto"}}>
                <FIcon name="chevron-right" size={18} color={"silver"} />
          </View>
        </TouchableOpacity>
    )
}

export const ToktokWalletRecoveryMethods = ({navigation , route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Recovery','']}/>,
    })
    
    const prompt = usePrompt()
    const { tokwaAccount , getMyAccountLoading , getMyAccount}  = useAccount();
    const type = route.params.type
    const event = route?.params?.event ? route.params.event : null
    const category = route?.params?.category ? route.params.category : null
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

    const refreshTokwaAccount = async ()=> {
        await getMyAccount()
        return
    }

    useEffect(()=>{
        if(!tokwaAccount.mobileNumber){
            refreshTokwaAccount();
            return
        } 
    },[])

    const recoverWallet = ()=> {
        getForgotAndRecoverOTPCode()
        // return navigation.navigate("ToktokWalletRecoverPin")
    }

    const [getForgotAndRecoverOTPCode] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getForgotAndRecoverOTPCode})=>{
            return navigation.navigate("ToktokWalletRecoverPin" , {type, event, category})
        },
        onError: (error)=>{
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt
            })
        }
    })


    return (
        <CheckIdleState>
        <Separator />
        <View style={styles.container}>
            <RecoveryMethod title={"Registered Mobile No."} message={`Use your verified mobile no. ${session.user.username}`} onPress={recoverWallet}/>
        </View>
        </CheckIdleState>
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
