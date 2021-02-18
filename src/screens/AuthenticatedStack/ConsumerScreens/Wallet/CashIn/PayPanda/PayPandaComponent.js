import React, { useState , useRef} from 'react'
import {
    StyleSheet,
    View,
    Modal,
    Button, 
    Text , 
    ActivityIndicator , 
    Dimensions , 
    TouchableOpacity , 
    TextInput , 
    TouchableHighlight , 
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import {MEDIUM,DARK,COLOR,ORANGE} from '../../../../../../res/constants'
import {useMutation} from '@apollo/react-hooks'
import {INITIALIZE_WALLET_CASHIN_DATA} from '../../../../../../graphql/model'
import {onError} from '../../../../../../util/ErrorUtility';

const {width,height} = Dimensions.get('window')

const PayPandaComponent = ()=> {
    const navigation = useNavigation()
    const routehook = useRoute()
    const webviewRef = useRef()
    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Cash-In', 'PayPanda']} />,
    }); 
    const [amount,setAmount] = useState("")
    const userstate = useSelector(state=>state.session.user)

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9]/g, '')
        setAmount(num.substring(0,1) == 0 ? num.slice(1) : num)
    }

    const [initializeWalletCashinData , {data,error,loading}] = useMutation(INITIALIZE_WALLET_CASHIN_DATA, {
        // fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: ({initializeWalletCashinData})=> {
            navigation.navigate("TokTokWalletCashINPaypandaWebView", {
                ...initializeWalletCashinData,
                email_address: userstate.person.emailAddress,
                payer_name: `${userstate.person.firstName}${userstate.person.middleName ? " " + userstate.person.middleName : ""} ${userstate.person.lastName}`,
                mobile_number: userstate.username,
                amount_to_pay: amount,
                currency: "PHP",
                walletId: routehook.params.walletId
            })
        }
    })

    const proceedToPaypandaPortal = ()=> {
        initializeWalletCashinData({
            variables: {
                input: {
                    amount: +amount,
                    walletId: routehook.params.walletId
                }
            }
        })
    }


    return (
        <>
        <View style={styles.container}>
                <View>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                            value={amount}
                            onChangeText={value=>changeAmount(value)}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="0"
                            autoFocus={true}
                           
                    />
                </View>

                <View style={{flex: 1 ,justifyContent: "flex-start", marginBottom: 20}}>
                   
                    <TouchableHighlight disabled={amount == 0} style={[styles.input, {marginTop: 20,justifyContent: "center",alignItems: "center", backgroundColor: DARK}]} onPress={proceedToPaypandaPortal}>
                            <Text style={[{color: COLOR}]}>Proceed</Text>
                    </TouchableHighlight>
                   
                </View>
               
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
    },
    input: {
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: MEDIUM,
        borderRadius: 5,
        paddingLeft: 20,
        height: 50,
        color: DARK,
      },
    label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
    },
})

export default PayPandaComponent