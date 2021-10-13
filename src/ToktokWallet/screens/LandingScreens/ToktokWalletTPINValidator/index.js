import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { YellowButton } from 'src/revamp';
import { CheckIdleState } from 'toktokwallet/components'

export const ToktokWalletTPINValidator = ({navigation,route})=> {


    navigation.setOptions({
        headerShown:false
    })

    const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null
    const loading = route?.params?.loading ? route.params.loading : null
    const pinCodeAttempt = route?.params?.pinCodeAttempt ? route.params.pinCodeAttempt : null

    const onPress = ()=> {
        callBackFunc({pinCode: "123456"})
    }
    return(
        <>
            <View style={styles.container}>
                <YellowButton label="Confirm" onPress={onPress}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    }
})