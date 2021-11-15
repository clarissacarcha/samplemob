import React , {useState,createContext, Children} from 'react'
import { PromptModal } from 'src/common/components'

const initialState = {
    type: "",
    title: "",
    message: "",
    visible: false,
    setVisible: ()=> null,
}

export const PromptProviderContext = createContext(initialState);
const {Provider} = PromptProviderContext;

export const PromptProvider = ({children})=> {

    const [promptState,setPromptstate] = useState(initialState)


    const prompt = ({type , title, message , onPress = null })=> {
        setPromptstate({
            type,
            title,
            message,
            visible: true,
            setVisible: ()=>  setPromptstate(initialState),
            onPress: ()=> {
                setPromptstate(initialState)
                onPress();
            }
        })
    }

    return (
        <Provider value={prompt}>
            <PromptModal {...promptState}/>
            {children}
        </Provider>
    )

}