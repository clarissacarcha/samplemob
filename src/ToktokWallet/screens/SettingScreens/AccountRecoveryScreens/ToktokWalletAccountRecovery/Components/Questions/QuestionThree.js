import React , {useState} from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput , Alert } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from 'src/components'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const QuestionThree = ({
    index,
    setIndex,
    question,
    answer,
})=> {

    const [myAnswer,setMyAnswer] = useState("");
    // const [visible,setVisible] = useState(false);
    const alert = useAlert();
    const navigation = useNavigation();


    const [getForgotAndRecoverOTPCode , {loading}] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getForgotAndRecoverOTPCode})=>{
            // return navigation.navigate("ToktokWalletAccountRecoveryOTP")
            return navigation.navigate("ToktokWalletRecoverPin" , {type: "MPIN" , event: "ACCOUNT RECOVERY"})
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const onPress = ()=> {
        if(myAnswer == "" ) return Alert.alert("","Answer is required.")
        if(myAnswer != answer ) return Alert.alert("","Answer is wrong.")
        getForgotAndRecoverOTPCode()
    }

    const onChangeText = (text)=> {
        setMyAnswer(text)
    }

    return (
        <>
            <AlertOverlay visible={loading}/>
            <View style={styles.container}>
                <View style={styles.body}>
                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Question</Text>
                            <View style={[styles.input , {justifyContent:'center'}]}>
                                <Text style={styles.labelSmall}>{question}</Text>
                            </View>
                        </View>
                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Answer</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter your answer here."
                                value={myAnswer}
                                onChangeText={onChangeText}
                                returnKeyType="done"
                                // onSubmitEditing={Proceed}
                            />
                        </View>
                </View>
                <View style={styles.btn}>
                        <YellowButton label="Next" onPress={onPress}/>
                </View>
                <BuildingBottom/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    body: {
        flex: 1,
    },
    btn: {
        height: 70,
        justifyContent: "flex-end"
    },
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    labelSmall: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color:"#929191"
    },
    ViewInput: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
    },
})

export default QuestionThree