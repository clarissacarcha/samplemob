import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput , ScrollView } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import moment from 'moment'


const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS


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


export const ViewAccountRecovery = ({
    data
})=> {

    const navigation = useNavigation();

    const onPress = ()=> {
        navigation.pop();
    }

    return (
        <>
        <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                    <Text style={styles.headerText}>Account Recovery helps you recover your account once
        deactivated or locked due to forgotten MPIN.</Text>
                        <Text style={styles.headerText}>Answer the following Security Questions that will be
        used for authentication in your account recovery process.</Text>
        <View style={{marginBottom: 20}}/>

        {
            data.map((data,index)=>(
                <Question
                    question={data.accountRecoveryQuestion.question}
                    answer={data.answer}
                    index={index}
                />
            ))
        }

        <Text style={[styles.headerText,{fontSize: FONT_SIZE.S}]}>Answers cannot be changed once saved.</Text>
        </ScrollView>
            <View style={styles.btn}>
                <YellowButton label="Back" onPress={onPress}/>
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