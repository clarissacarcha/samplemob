import React , {useState} from 'react'
import { View } from 'react-native'
import { BuildingBottom } from 'toktokwallet/components'

//SELF IMPORTS
import QuestionOne from './QuestionOne'
import QuestionTwo from './QuestionTwo'
import QuestionThree from './QuestionThree'

export const Questions = ({questions,answers}) => {

    const [index,setIndex] = useState(0)

    const DisplayScreen = ()=> {

        switch(index){
            case 0:
                return <QuestionOne 
                            index={index}
                            setIndex={setIndex}
                            answer={answers[0]}
                            question={questions[0]}
                       />
            case 1:
                return <QuestionTwo 
                                index={index}
                                setIndex={setIndex}
                                answer={answers[1]}
                                question={questions[1]}
                        />
            case 2:
                return <QuestionThree
                                index={index}
                                setIndex={setIndex}
                                answer={answers[2]}
                                question={questions[2]}
                        />
            default:
                break
        }
    }

    return (
        <View style={{flex:1}}>
                {DisplayScreen()}
                <BuildingBottom/>
        </View>
    )
}