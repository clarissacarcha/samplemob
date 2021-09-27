import React , {useState} from 'react'

//SELF IMPORTS
import QuestionOne from './QuestionOne'
import QuestionTwo from './QuestionTwo'
import QuestionThree from './QuestionThree'
import Questions from './Questions'
import Confirm from './Confirm'

const questions = [
    "What is your mother's maiden name?",
    "When is your Birthday?",
    "What is your current Address?",
]

export const SetupAnswers = ()=> {

    const [currentIndex,setCurrentIndex] = useState(0)
    const [answers,setAnswers] = useState([
        "",
        "",
        "",
    ])

    const RenderComponent = ()=> {

        switch(currentIndex){

            case 0:
                return <Questions
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                questions={questions}
                                answers={answers}
                                setAnswers={setAnswers}
                        />
            case 1:
                return <Confirm
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                questions={questions}
                                answers={answers}
                        />
            default: 
                break
        }

    }

    return (
        <>
        {RenderComponent()}
        </>
    )
}
