import React, { useState } from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput , ScrollView } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom , PromptModal } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_ACCOUNT_RECOVERY , POST_REQUEST_ACCOUNT_RECOVERY_OTP } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert , usePrompt } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from 'src/components'
import { TransactionUtility } from 'toktokwallet/util'
import moment from 'moment'


const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const Question = ({question, answer , index })=> {

    let maskAsterisk = ""
    
    for(let x = 0 ; x < answer.length - 1 ; x++ ){
        maskAsterisk = maskAsterisk + "*"
    }

    return (
        <View style={styles.ViewInput}>
        <Text style={styles.labelText}>{index + 1} ) {question}</Text>
        <View style={styles.viewAnswer}>
            <Text style={styles.viewAnswerText}>{index == 1 ? `${moment(answer).tz('Asia/Manila').format('MMM DD, YYYY')[0]}${maskAsterisk}` : `${answer[0]}${maskAsterisk}`}</Text>
        </View>
    </View>
    )
}

const Confirm = ({
    currentIndex,
    setCurrentIndex,
    questions,
    answers,
})=> {

    const alert = useAlert();
    const prompt = usePrompt();
    const navigation = useNavigation();
    const [visible,setVisible] = useState(false)

    const [postRequestAccountRecoveryOTP , {loading: requestLoading}] = useMutation(POST_REQUEST_ACCOUNT_RECOVERY_OTP,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestAccountRecoveryOTP})=> {
            return navigation.navigate("ToktokWalletOTPValidator", {
                callBackFunc: Proceed,
                resendRequest: requestOTP ,
            })
        },
        onError: (error)=> {
            onErrorAlert({alert,error,navigation,title: "Transaction Void"})
        }

    })

    const [postAccountRecovery , {loading}] = useMutation(POST_ACCOUNT_RECOVERY, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ()=>{
          setVisible(true)
        },
        onError: (error)=> {
            // onErrorAlert({alert,error,navigation})
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt 
            })
        }
    })

    const requestOTP = ()=> {
        postRequestAccountRecoveryOTP()
    }

    const Proceed = ({pinCode = null , Otp = null , data = null})=> {
        postAccountRecovery({
            variables: {
                input: {
                    answers: answers,
                    OTPCode: Otp,
                }
            }
        })
    }
   
    return (
        <>
            <AlertOverlay visible={loading || requestLoading}/>
            <PromptModal 
                    visible={visible}
                    title="Security Questions Set Up!"
                    message={`${'1. Remember all your answers and do not share them with anyone.'}${'\n\n'}${'2. Always keep your MPIN and never share this with anyone.'}`}
                    event="success"
                    onPress={()=>{
                        setVisible(false)
                        navigation.pop();
                        navigation.replace("ToktokWalletAccountRecoverySetup");
                    }}
            />

            <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                    <Text style={styles.headerText}>Account Recovery helps you recover your account once
    deactivated or locked due to forgotten MPIN.</Text>
                    <Text style={styles.headerText}>Answer the following Security Questions that will be
    used for authentication in your account recovery process.</Text>
                     <View style={{marginBottom: 20}}/>
                        {
                            questions.map((question,index)=>(
                                <Question
                                    question={question.question}
                                    answer={answers[index].answer}
                                    index={index}
                                />
                            ))
                        }
                    <Text style={[styles.headerText,{fontSize: FONT_SIZE.S}]}>Answers cannot be changed once saved.</Text>
                </ScrollView>
                <View style={styles.btn}>
                        <YellowButton label="Save" onPress={requestOTP}/>
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
    headerText: {
        textAlign:'center',
        marginHorizontal: 10,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color:COLOR.ORANGE,
        marginVertical: 2,
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
        marginVertical: 10,
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
    errorMessage: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.XS,
        color: COLOR.RED
    },
    viewAnswer: {
        justifyContent:"center",
        // alignItems:"center",
        height: SIZE.FORM_HEIGHT,
    },
    viewAnswerText: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
    }
})

export default Confirm