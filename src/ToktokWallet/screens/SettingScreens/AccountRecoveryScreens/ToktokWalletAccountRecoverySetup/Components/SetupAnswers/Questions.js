import React , {useState,useEffect} from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom , DisabledButton} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import moment from 'moment'
import calendar_icon from 'toktokwallet/assets/icons/calendar-icon.png';

//SELF IMPORTS
import DateBirthModal from './DateBirthModal'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');


export const DisplayQuestion = ({question ,answers , setAnswers , index })=> {

  const [visible,setVisible] = useState(false);

  const onChangeText = (text)=> {
    setAnswers(state=>{
      if(text != ""){
        state[index] = {
          accountRecoveryQuestionId: question.id,
          answer: text
        }
      }else{
        answers.splice(index, 1)
      }
        
      return [...state]
    })
    setVisible(false)
  }

  return(
    <>
      <DateBirthModal
        visible={visible} 
        hidePicker={()=>setVisible(false)}
        onDateSelect={onChangeText}       
      />
      {
        question.isDatepicker ? (
          <View style={styles.ViewInput}>
            <Text style={styles.labelText}>{index + 1} ) {question.question}</Text>
            <TouchableOpacity onPress={()=>setVisible(true)} style={[styles.input, styles.secondContainer]}>
              {
                !answers[index]?.answer
                ?  <Text style={styles.labelSmall}>Enter your answer..</Text>
                :  <Text style={[styles.labelSmall, {color:"black"}]}>{moment(answers[index].answer).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
              }
              <Image source={calendar_icon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ViewInput}>
            <Text style={styles.labelText}>{index + 1} ) {question.question}</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your answer.."
              value={answers[index]?.answer ? answers[index].answer : ""}
              onChangeText={onChangeText}
              returnKeyType="done"
              maxLength={question.maxLength}
              // onSubmitEditing={Proceed}
            />
          </View>
        )
      }
    </>
  )
}

export const RenderNextButton = ({questions,btnEnabled,onPress})=> {
  if(questions.length == 0) return null
  if(btnEnabled && questions.length > 0) return <YellowButton label="Next" onPress={onPress}/>
  return <DisabledButton label="Next"/>
}


const Questions = ({
  questions,
  answers,
  currentIndex,
  setCurrentIndex,
  setAnswers,
})=> {

  const [errorMessages,setErrorMessages] = useState([])
  const [btnEnabled,setBtnEnabled] = useState(false)

  useEffect(()=>{
    setBtnEnabled(+answers.length === +questions.length)
  },[answers,questions])

  const onPress = ()=> {
    answers.forEach((answer,index)=>{
      if(answer == ""){
        setErrorMessages(state=>{
          state[index] = "this field is required."
          return [...state]
        })
      } else {
        setErrorMessages(state=>{
          state[index] = ""
          return [...state]
        })
      }
    })
    const [a,b,c] = [...answers]
    if(a == "" || b == "" || c == "") return
    setCurrentIndex(value=>value+1)
  }

  return(
    <>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
          <Text style={styles.headerText}>Account Recovery helps you recover your account once deactivated or locked due to forgotten MPIN.</Text>
          <Text style={styles.headerText}>Answer the following Security Questions that will be used for authentication in your account recovery process.</Text>
          {
            questions.map((question,index)=>{
              return (
                <DisplayQuestion
                  question={question}
                  answers={answers}
                  setAnswers={setAnswers}
                  index={index}
                />
              )
            })
          }
          <Text style={[styles.headerText,{fontSize: FONT_SIZE.S}]}>Answers cannot be changed once saved.</Text>
        </ScrollView>
        <View style={styles.btn}>
          <RenderNextButton
            questions={questions}
            btnEnabled={btnEnabled}
            onPress={onPress}
          />
        </View>
        <BuildingBottom/>
      </KeyboardAvoidingView>
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
    justifyContent: "flex-end",
    marginBottom: 16
  },
  headerText: {
    textAlign:'center',
    marginHorizontal: 10,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color:COLOR.ORANGE,
    marginVertical: 10,
  },
  labelText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    marginBottom: 10
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
  },
  secondContainer: {
    alignItems:'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})

export default Questions