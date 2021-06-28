import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,Alert} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBack, YellowButton,HeaderTitle } from '../../../../../../revamp';
import {AlertOverlay, SomethingWentWrong} from '../../../../../../components'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants';
import { Separator } from '../../Components';
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert,onError} from '../../../../../../util/ErrorUtility'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql/'
import {POST_CASH_OUT_ENROLLMENT_BDO} from '../../../../../../graphql/toktokwallet';
import { useMutation } from '@apollo/react-hooks';
import { FONT, FONT_SIZE } from '../../../../../../res/variables';
import validator from 'validator';

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal';

 const ToktokWalletBDORegistration = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["BDO Account"]}/>
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const {accountNumber , provider} = route.params
    const [accountName,setAccountName] = useState(`${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`)
    const [email,setEmail] = useState(tokwaAccount.person.emailAddress)
    const [showModal,setShowModal] = useState(false)
    const alert = useAlert()

    const [postCashOutEnrollmentBdo, {data, error ,loading}] = useMutation(POST_CASH_OUT_ENROLLMENT_BDO, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: (res) => {
            setShowModal(true)
        },
  });

    const saveAccount = ()=> {
        if (validator.isEmpty(accountName, {ignore_whitespace: true})) {
            return Alert.alert("","Account Name is required.")
        }

        if (validator.isEmpty(email, {ignore_whitespace: true})) {
            return Alert.alert("","Email Address is required.")
        }

        if (!validator.isEmail(email, {ignore_whitespace: true})) {
            return Alert.alert("","Email format is invalid.")
        }

        postCashOutEnrollmentBdo({
            variables: {
                input: {
                    accountNumber: accountNumber,
                    accountName: accountName,
                    emailAddress: email,
                }
            }
        })
    }

    return (
        <>
        <AlertOverlay visible={loading}/>
        <SuccessfulModal
            visible={showModal}
            setVisible={setShowModal}
            provider={provider}
        />
        <Separator/>
        <View style={styles.container}>
            <View style={{flex: 1,}}>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[styles.input, {justifyContent:"center"}]}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountNumber}</Text>
                        </View>
                    </View>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput 
                                    style={styles.input}
                                    value={accountName}
                                    returnKeyType="done"
                                    placeholder="Enter Account Name here"
                                    onChangeText={(value)=>setAccountName(value)}
                            />
                        </View>
                    </View>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Email Address</Text>
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput 
                                    style={styles.input}
                                    value={email}
                                    returnKeyType="done"
                                    placeholder="Enter Email Address here"
                                    onChangeText={(value)=>setEmail(value)}
                            />
                        </View>
                    </View>
            </View>

            <View style={{height: 70,justifyContent:'flex-end'}}>
                <YellowButton label="Save" onPress={saveAccount}/>
            </View>

        </View>
        </>
     )
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
})


 export default ToktokWalletBDORegistration