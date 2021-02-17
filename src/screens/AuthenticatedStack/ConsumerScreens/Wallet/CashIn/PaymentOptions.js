import React from 'react'
import {View,StyleSheet,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {HeaderBack, HeaderTitle} from '../../../../../components'
import {CardShadow, CardHeader, CardBody, CardRow, Hairline, SizedBox} from '../../../../../components/widgets';


const PaymentOptions = ()=> {
    const navigation = useNavigation()
    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Cash-In', 'Methods']} />,
    }); 
    return (
        <>
        <View style={styles.container}>
            <CardShadow onPress={()=> navigation.navigate("TokTokWalletCashInPaypanda")}>
                <CardBody>
                    <Image style={{height: 50,width: "100%"}} source={require('../../../../../assets/images/paypanda.png')} resizeMode="contain"/>
                </CardBody>
            </CardShadow>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    }
})

export default PaymentOptions