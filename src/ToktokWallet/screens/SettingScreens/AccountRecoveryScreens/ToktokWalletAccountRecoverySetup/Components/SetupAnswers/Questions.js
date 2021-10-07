import React , {useState,useEffect} from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput ,TouchableOpacity , ScrollView } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom , DisabledButton} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import moment from 'moment'

//SELF IMPORTS
import DateBirthModal from './DateBirthModal'

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
                            :  <Text style={[styles.labelSmall, {color:"black"}]}>{moment(answers[1]).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
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


const Questions = ({
    questions,
    answers,
    currentIndex,
    setCurrentIndex,
    setAnswers,
})=> {


    const [errorMessages,setErrorMessages] = useState([
        "",
        "",
        "",
    ])

    const onPress = ()=> {
        answers.forEach((answer,index)=>{
            if(answer == ""){
                setErrorMessages(state=>{
                    state[index] = "this field is required."
                    return [...state]
                })
            }else {
                setErrorMessages(state=>{
                    state[index] = ""
                    return [...state]
                })
            }
        })
        const [a,b,c] = [...answers]
        if(a == "" || b == "" || c ==" ") return
        setCurrentIndex(value=>value+1)
    }

    return(
        <>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                <Text style={styles.headerText}>Account Recovery helps you recover your account once
deactivated or locked due to forgotten MPIN.</Text>
                <Text style={styles.headerText}>Answer the following Security Questions that will be
used for authentication in your account recovery process.</Text>
                    <Question
                        answers={answers}
                        setAnswers={setAnswers}
                        questions={questions}
                        errorMessages={errorMessages}
                        index={0}
                        maxLength={30}
                    />
                    <Question
                        answers={answers}
                        setAnswers={setAnswers}
                        questions={questions}
                        errorMessages={errorMessages}
                        dateModal
                        index={1}
                    />

                    <Question
                        answers={answers}
                        setAnswers={setAnswers}
                        questions={questions}
                        errorMessages={errorMessages}
                        index={2}
                        maxLength={70}
                    />

                    <Text style={[styles.headerText,{fontSize: FONT_SIZE.S}]}>Answers cannot be changed once saved.</Text>

                </ScrollView>
                <View style={styles.btn}>
                    {
                        answers[0] == "" || answers[1] == "" || answers[2] == ""
                        ?  <DisabledButton label="Next"/>
                        :  <YellowButton label="Next" onPress={onPress}/>
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

export default Questions