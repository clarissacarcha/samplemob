import React from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { Alert } from 'react-native'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const QuestionThree = ({
    currentIndex,
    setCurrentIndex,
    question,
    answers,
    setAnswers,
})=> {

    const onPress = ()=> {
        if(answers[2] == "" ) return Alert.alert("","Answer is required.")
        setCurrentIndex(state=>state+1)
    }

    const onChangeText = (text)=> {
        setAnswers(state=>{
            state[2] = text
            return [...state]
        })
    }

    return (
        <>
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
                                value={answers[2]}
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