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

const DropDownQuestion = ({question , sourceRef, pepInfoAnswer, index ,setPepInfo})=> {

    const openBottomSheet = ()=> {
        sourceRef.current.expand()
    }

    const onChangeText = (value)=>{
        if(index == 0){
            setPepInfo(state=>{
                return {
                    ...state,
                    questionnaire: {
                        ...state.questionnaire,
                        sourceOfIncome: value,
                    }
                }
            })
        }

        if(index == 1){
            setPepInfo(state=>{
                return {
                    ...state,
                    questionnaire: {
                        ...state.questionnaire,
                        sourceOfWealth: value,
                    }
                }
            })
        }
    }

    return (
        <View style={{marginTop: 10}}>
             <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{question}</Text>
            <TouchableOpacity onPress={openBottomSheet} style={[styles.input , {flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}]}>
                <Text
                    style={pepInfoAnswer.des != "" 
                        ? {flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR} 
                        : {flex: 1,color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}
                    }
                >
                    {pepInfoAnswer.des != "" ? pepInfoAnswer.des : "- Select -"}
                </Text>
                <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right"/>
            </TouchableOpacity>
            {
                pepInfoAnswer.value == "0" &&
                <View style={{marginTop: 10,}}>
                    <TextInput 
                        placeholder={`Specify source of ${index == 0 ? "income" : "wealth"}`}
                        style={styles.input}
                        value={pepInfoAnswer.others}
                        onChangeText={onChangeText}
                    />
                </View>
            }
        </View>
    )
}

export const PepQuestionnaireModal = ({
    visible,
    setVisible,
    onRequestClose,
    pepInfo,
    setPepInfo,
    callback,
})=> {

    const [errorMessage,setErrorMessage] = useState([
        "","","",""
    ])
    const [agree,setAgree] = useState(false)

    const closeModal = ()=> {
        onRequestClose();
    }

    const onPress = ()=> {
        callback()
    }

    const changeIncomeInfo = (flag , incomeInfo)=> {
        setPepInfo(state=>{
            return {
                ...state,
                questionnaire: {
                    ...state.questionnaire,
                    sourceOfIncomeId: flag == "source" ? incomeInfo.id : "0",
                    sourceOfIncomeDes: flag == "source" ? incomeInfo.description : "others",
                    sourceOfIncome: ""
                }
            }
        })
    }

    const changeWealthInfo = (flag , wealthInfo)=> {
        setPepInfo(state=>{
            return {
                ...state,
                questionnaire: {
                    ...state.questionnaire,
                    sourceOfWealthId: flag == "source" ? wealthInfo.id : "0",
                    sourceOfWealthDes: flag == "source" ? wealthInfo.description : "others",
                    sourceOfWealth: ""
                }
            }
        })
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

    return(
        <Modal
            style={styles.container}
            transparent={false}
            visible={visible}
            onRequestClose={closeModal}
        >
                <ScrollView 
                    contentContainerStyle={{flexGrow:1}}
                    style={styles.headings}
                >
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,textAlign:"center"}}>Politically Exposed Person (PEP) Questionnaire</Text>
                    <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,marginTop:20}}>
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
                            question="1) Have you been categorized as PEP (Political Exposed Person)
                            by a bank, brokerage firm or any financial institution?"
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

                        {/* <DropDownQuestion
                            question="3) Source of Income"
                            index={0}
                            sourceRef={SourceOfIncomeRef}
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.sourceOfIncomeId,
                                des: pepInfo.questionnaire.sourceOfIncomeDes,
                                others: pepInfo.questionnaire.sourceOfIncome
                            }}
                            setPepInfo={setPepInfo}
                        />

                        <DropDownQuestion
                            question="4) Source of Wealth"
                            index={1}
                            sourceRef={SourceOfWealthRef}
                            pepInfoAnswer={{
                                value: pepInfo.questionnaire.sourceOfWealthId,
                                des: pepInfo.questionnaire.sourceOfWealthDes,
                                others: pepInfo.questionnaire.sourceOfWealth
                            }}
                            setPepInfo={setPepInfo}
                        /> */}
                    </View>

                    <View style={{flexDirection:"row",marginTop :50,alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>setAgree(!agree)} style={[styles.answerbox, {height: 20, backgroundColor: agree ? COLOR.YELLOW : "transparent"}]}/>
                            <Text style={{paddingRight: 16, fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M, textAlign:"left"}}>I hereby certify that the above infomation provided is true and correct to the best of my knowledege</Text>
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
                            ? <YellowButton label="Proceed" onPress={onPress}/>
                            : <DisabledButton label="Proceed"/>
                        }
                      
                    </View>
                </ScrollView>
                <BuildingBottom/>
                
              
        </Modal>
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
    }
})