import React, { useState } from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput , Alert , TouchableOpacity} from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import moment from 'moment'

//SELF IMPORTS
import DateBirthModal from './DateBirthModal'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const QuestionTwo = ({
    currentIndex,
    setCurrentIndex,
    question,
    answers,
    setAnswers,
})=> {

    const [visible,setVisible] = useState(false);
    
    const onPress = ()=> {
        if(answers[1] == "" ) return Alert.alert("","Answer is required.")
        setCurrentIndex(state=>state+1)
    }


    const onDateSelect = (date)=> {
        setAnswers(state=>{
            state[1] = date
            return [...state]
        })
        setVisible(false)
    }

    return (
        <>
            <DateBirthModal
                visible={visible} 
                hidePicker={()=>setVisible(false)}
                onDateSelect={onDateSelect}       
            />
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
                            <TouchableOpacity onPress={()=>setVisible(true)} style={[styles.input , {justifyContent:'center'}]}>
                               {
                                   answers[1] == ""
                                   ?  <Text style={styles.labelSmall}>Choose Date</Text>
                                   :  <Text style={styles.labelSmall}>{moment(answers[1]).tz('Asia/Manila').format('MMM DD, YYYY')}</Text>
                               }
                            </TouchableOpacity>
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

export default QuestionTwo