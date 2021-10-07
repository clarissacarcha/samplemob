import React , {useState,useEffect} from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput ,TouchableOpacity , ScrollView } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom , DisabledButton , PromptModal } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import moment from 'moment'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from 'src/components'

//SELF IMPORTS
import DateBirthModal from '../../../ToktokWalletAccountRecoverySetup/Components/SetupAnswers/DateBirthModal'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const Question = ({questions, answers, setAnswers, index , dateModal , errorMessages , maxLength = null})=> {

    const [visible,setVisible] = useState(false);

    const onChangeText = (text)=> {
        setAnswers(state=>{
            state[index] = text
            return [...state]
        })
        setVisible(false)
    }

    return (
        <>
            <DateBirthModal
                visible={visible} 
                hidePicker={()=>setVisible(false)}
                onDateSelect={onChangeText}       
            />
         {
             dateModal
             ?  <View style={styles.ViewInput}>
                    <Text style={styles.labelText}>{index + 1} ) {questions[index]}</Text>
                    <TouchableOpacity onPress={()=>setVisible(true)} style={[styles.input , {justifyContent:'center'}]}>
                        {
                            answers[index] == ""
                            ?  <Text style={styles.labelSmall}>Choose Date</Text>
                            :  <Text style={{...styles.labelSmall,color:"black"}}>{moment(answers[1]).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
                        }
                    </TouchableOpacity>
                </View>
             :  <View style={styles.ViewInput}>
                    <Text style={styles.labelText}>{index + 1} ) {questions[index]}</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your answer here."
                        value={answers[index]}
                        onChangeText={onChangeText}
                        returnKeyType="done"
                        maxLength={maxLength}
                        // onSubmitEditing={Proceed}
                    />
                </View>
         }
         { errorMessages[index] != "" && <Text style={styles.errorMessage}>{errorMessages[index]}</Text>}
      </>
    )
}


export const QuestionsAnswers = ({
    questions,
    answers,
})=> {
    const alert = useAlert();
    const navigation = useNavigation();
    const [showPrompt,setShowPrompt] = useState(false)

    const [answersForm, setAnswersForm] = useState([
        "",
        "",
        ""
    ])
    const [errorMessages,setErrorMessages] = useState([
        "",
        "",
        "",
    ])

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
        answersForm.forEach((answer,index)=>{
            if(answer == ""){
                setErrorMessages(state=>{
                    state[index] = "this field is required."
                    return [...state]
                })
            }else if(answer != answers[index]){
                return setShowPrompt(true)
                setErrorMessages(state=>{
                    state[index] = "Answer is wrong."
                    return [...state]
                })
            }else {
                setErrorMessages(state=>{
                    state[index] = ""
                    return [...state]
                })
            }
        })
        const [a,b,c] = [...answersForm]
        if(a == "" || b == "" || c ==" ") return
        if(a != answers[0] || b != answers[1] || c != answers[2]) return
        getForgotAndRecoverOTPCode()
    }

    const closePrompt = ()=> {
        setShowPrompt(false)
        return navigation.navigate("ToktokWalletRestricted", {showPrompt: true})
    }

    return(
        <>
             <AlertOverlay visible={loading}/>
             <PromptModal
                    visible={showPrompt}
                    title="Incorrect answers!"
                    message="Sorry, you have entered incorrect answers, please email Customer Service for your account recovery"
                    event="error"
                    onPress={closePrompt}
             />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                    <Question
                        answers={answersForm}
                        setAnswers={setAnswersForm}
                        questions={questions}
                        errorMessages={errorMessages}
                        index={0}
                        maxLength={30}
                    />
                    <Question
                        answers={answersForm}
                        setAnswers={setAnswersForm}
                        questions={questions}
                        errorMessages={errorMessages}
                        dateModal
                        index={1}
                    />

                    <Question
                        answers={answersForm}
                        setAnswers={setAnswersForm}
                        questions={questions}
                        errorMessages={errorMessages}
                        index={2}
                        maxLength={70}
                    />

                </ScrollView>
                <View style={styles.btn}>
                    {
                        answersForm[0] == "" || answersForm[1] == "" || answersForm[2] == ""
                        ? <DisabledButton label="Confirm"/>
                        :  <YellowButton label="Confirm" onPress={onPress}/>
                    }
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
    errorMessage: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.XS,
        color: COLOR.RED
    }
})
