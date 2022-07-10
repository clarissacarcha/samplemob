import React, { useState , useEffect , useRef} from 'react'
import { StyleSheet , View , Text , Modal, ScrollView, TouchableOpacity , TextInput} from 'react-native'
import { getStatusbarHeight } from 'toktokwallet/helper'
import { Separator , BuildingBottom , DisabledButton } from 'toktokwallet/components';
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    SourceOfIncome,
    SourceOfWealth
} from "./Components"

const {COLOR, FONT_FAMILY: FONT ,SIZE,FONT_SIZE} = CONSTANTS

const Question = ({question,errorMessage,setErrorMessage,index,chooseAnswer,pepInfoAnswer})=> {
    const answers = [
        {value: "1",display: "Yes" , position:""},
        {value: "2",display: "No", position:""},
        {value: "3",display: "I don't know", position:""}
    ]
    const [answer,setAnswer] = useState(pepInfoAnswer)
    const onChangeText = (text)=> {
      
        setErrorMessage(state=> {
            state[index] = text.length > 0 && answer.value == 1 ? "" : "this field is required."
            return [...state,]
        })

        setAnswer(state=>(
            {
                ...state,
                position: text
            }
        ))
    }

    useEffect(()=>{
       if(answer){
            chooseAnswer({
                ans: answer?.value ,
                position: answer?.position,
                index: index
             })
       }
    },[answer])

    return(
        <View style={{marginTop: 10}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{question}</Text>
            <View style={{flexDirection:"row",marginVertical: 10,justifyContent:'space-between'}}>
                {
                    answers.map((ans,index)=>(
                        <View style={{flexDirection:"row"}}>
                                <TouchableOpacity 
                                    onPress={()=>setAnswer(ans)} 
                                    style={[styles.answerbox,{backgroundColor: answer?.value == ans.value ? COLOR.YELLOW : "transparent"}]}
                                    hitSlop={{top: 20, bottom: 20, left: 20 ,right: 20}}
                                >

                                </TouchableOpacity>
                                <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>{ans.display}</Text>
                        </View>
                    ))
                }
            </View>
            {
                    answer?.value == "1" &&
                    <>
                    <TextInput
                        value={answer.position}
                        onChangeText={onChangeText} 
                        style={styles.input}
                        placeholder="Specify position"
                        maxLength={50}
                    />
                        {/* {
                            errorMessage[index] != "" &&
                            <Text>{errorMessage[index]}</Text>
                        } */}
                    </>

            }

          
        </View>
    )
}



export const PepQuestionnaire = ({
    pepInfo,
    setPepInfo,
    callback,
})=> {

    const [errorMessage,setErrorMessage] = useState([
        "","","",""
    ])
    const [agree,setAgree] = useState(false)

    const onPress = ()=> {
        callback()
    }

    const chooseAnswer = ({ ans, position , index})=> {
        if(index == 0){
            setPepInfo(state=> {
                return {
                    ...state,
                   questionnaire: {
                       ...state.questionnaire,
                       isPep: ans,
                       pepPosition: position
                   }
                }
            })
        }

        if(index == 1){
            setPepInfo(state=> {
                return {
                    ...state,
                    questionnaire: {
                        ...state.questionnaire,
                        isFamilyPep: ans,
                        familyPepPosition: position
                    }  
                }
            })
        }

    }

    return (
        <>
              <ScrollView 
                    contentContainerStyle={{flexGrow:1}}
                    style={styles.headings}
                >
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,textAlign:"center"}}>Politically Exposed Person (PEP) Questionnaire</Text>
                    <Text style={{textAlign:"left",fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,marginTop:20,fontStyle: "italic"}}>
                    A “politically exposed person” or PEP is a current or former
                    senior official in the executive, legislative, administrative,
                    military or judicial branch of a foreign government, elected
                    or not; a senior official of a major foreign political party; a
                    senior executive of a foreign government-owned commercial
                    enterprise, and/or being a corporation, business or other
                    entity formed by or for the benefit of any such individual; an
                    immediate family member of such individual (including spouse,
                    parents, siblings, children, and spouse’s parents or siblings);
                    and any individual publicly known to be a close personal or
                    professional associate. 
                    </Text>
                    <View style={styles.questions}>
                        <Question
                            question="1) Have you ever been categorized as PEP (Political Exposed Person)
                            by a bank, brokerage firm, or any financial institution?"
                            errorMessage={errorMessage}
                            setErrorMessage={setErrorMessage}
                            chooseAnswer={chooseAnswer}
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.isPep,
                                position: pepInfo.questionnaire.pepPosition
                            }}
                            index={0}
                        />

                        <Question
                            question="2) Do you have an immediate family member or business/close
                            associate which is currently/formally qualified as PEP?"
                            errorMessage={errorMessage}
                            setErrorMessage={setErrorMessage}
                            chooseAnswer={chooseAnswer}
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.isFamilyPep,
                                position: pepInfo.questionnaire.familyPepPosition
                            }}
                            index={1}
                        />

                        <SourceOfIncome
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.sourceOfIncomeId,
                                des: pepInfo.questionnaire.sourceOfIncomeDes,
                                others: pepInfo.questionnaire.sourceOfIncome
                            }}
                            setPepInfo={setPepInfo}
                        />

                        <SourceOfWealth
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.sourceOfWealthId,
                                des: pepInfo.questionnaire.sourceOfWealthDes,
                                others: pepInfo.questionnaire.sourceOfWealth
                            }}
                            setPepInfo={setPepInfo}
                        />

                    </View>

                    <View style={{flexDirection:"row",marginTop :50,alignItems:"center"}}>
                            <TouchableOpacity hitSlop={styles.hitSlop} onPress={()=>setAgree(!agree)} style={[styles.answerbox, {height: 20, backgroundColor: agree ? COLOR.YELLOW : "transparent"}]}/>
                            <Text style={{paddingRight: 16, fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M, textAlign:"left"}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M, textAlign:"left"}}>I HEREBY CERTIFY </Text>
                             that the above information is complete, true, and correct as to the best of my knowledge.
                             </Text>
                    </View>
                    
                    <View style={{flexGrow: 1,justifyContent:"flex-end",marginBottom: 16,marginTop: 100}}>
                        {   
                            pepInfo.questionnaire.isPep != ""
                            && pepInfo.questionnaire.isFamilyPep != ""
                            && pepInfo.questionnaire.sourceOfIncomeId != ""
                            && pepInfo.questionnaire.sourceOfWealthId != ""
                            && (
                                pepInfo.questionnaire.isPep == "1"
                                ? pepInfo.questionnaire.pepPosition != ""
                                : pepInfo.questionnaire.pepPosition == ""
                            )
                            && (
                                pepInfo.questionnaire.isFamilyPep == "1"
                                ? pepInfo.questionnaire.familyPepPosition != ""
                                : pepInfo.questionnaire.familyPepPosition == ""
                            )
                            && (
                                pepInfo.questionnaire.sourceOfIncomeId.includes("0")
                                ? pepInfo.questionnaire.sourceOfIncome != ""
                                : pepInfo.questionnaire.sourceOfIncome == ""
                            )
                            && (
                                pepInfo.questionnaire.sourceOfWealthId.includes("0")
                                ? pepInfo.questionnaire.sourceOfWealth != ""
                                : pepInfo.questionnaire.sourceOfWealth == ""
                            )
                            && agree
                            ? <YellowButton label="Save" onPress={onPress}/>
                            : <DisabledButton label="Save"/>
                        }
                      
                    </View>
                </ScrollView>
                <BuildingBottom/>
        </>
    )
}

const styles =  StyleSheet.create({
    container: {
        marginTop: getStatusbarHeight,
        padding: 16,
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    questions: {
        marginTop:20,
    },
    answerbox: {
        borderWidth: 0.5,
        borderColor:COLOR.YELLOW,
        padding: 10,
        marginRight: 10,
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
    hitSlop: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
})