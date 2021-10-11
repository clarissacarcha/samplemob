import React from 'react'
import { View , Text ,StyleSheet , ActivityIndicator } from 'react-native'
import { HeaderBack , HeaderTitle} from 'src/revamp'
import { Separator , CheckIdleState} from 'toktokwallet/components'

//SELF IMPORTS
import {
    Questions,
    QuestionsAnswers
} from "./Components";
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS

export const ToktokWalletAccountRecovery = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Account Recovery','']}/>,
    })


    const data = route.params.data
    const questions = JSON.parse(data.questions)
    const answers = JSON.parse(data.answers)

    return (
        <CheckIdleState>
            <Separator/>
            <View style={styles.container}>
                <QuestionsAnswers
                    questions={questions}
                    answers={answers}
                />
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    }
})