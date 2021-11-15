import React , {useState , useEffect , useRef } from 'react';
import { View , Text ,StyleSheet } from 'react-native';
import { HeaderBack , HeaderTitle , Separator , OrangeButton } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'
import { useAccount } from 'toktokwallet/hooks'

export const ToktokBillsEnterOTP = ({navigation ,route})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={"toktokbills"} isRightIcon/>,
        headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
    });
    

    const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null
    const errorMessage = route?.params?.errorMessage ? route.params.errorMessage : null
    const resendRequest = route?.params?.resendRequest ? route.params.resendRequest : null
    const data = route?.params?.data ? route.params.data : null

    const [otpCode,setOtpCode] = useState("")
    const inputRef = useRef();
    const {tokwaAccount, getMyAccount} = useAccount()
    const [otpTimer,setOtpTimer] = useState(120)

    useEffect(()=>{
        if(!tokwaAccount.mobileNumber){
            getMyAccount();
        }
    },[])

    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <View style={{flex: 1}}>

            </View>
            <OrangeButton
                disabled={otpCode.length < 6}
                label="Confirm"
                onPress={()=>{
                    callBackFunc({Otp: otpCode , data: data})
                }}
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    }
})