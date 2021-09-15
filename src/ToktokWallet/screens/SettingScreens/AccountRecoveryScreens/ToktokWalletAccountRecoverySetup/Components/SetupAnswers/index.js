import React , {useState} from 'react'

//SELF IMPORTS
import QuestionOne from './QuestionOne'
import QuestionTwo from './QuestionTwo'
import QuestionThree from './QuestionThree'
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
                return <QuestionOne
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                question={questions[0]}
                                answers={answers}
                                setAnswers={setAnswers}
                        />
            case 1:
                return <QuestionTwo
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                question={questions[1]}
                                answers={answers}
                                setAnswers={setAnswers}
                        />
            case 2: 
                return <QuestionThree
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                question={questions[2]}
                                answers={answers}
                                setAnswers={setAnswers}
                        />
            case 3:
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
