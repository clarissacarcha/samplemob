import React , {useState} from 'react'
import { PromptModal } from 'toktokbills/components'

const initialState = {
    type: "",
    title: "",
    message: "",
    visible: false,
}

export const usePrompt = ({
    type,
    title,
    message,
})=> {

    const [promptState,setPromptstate] = useState(initialState)

    const closeModal = ()=> {
        setPromptstate(initialState)
    }

    const prompt = ({type , title, message })=> {
        setPromptstate({
            type,
            title,
            message,
            visible: true
        })
    }

    return (
        <PromptModal {...promptState} />
    )

}