import React , {useState,createContext, Children} from 'react'
import { PromptModal } from 'src/common/components'

const initialState = {
  type: "",
  title: "",
  message: "",
  event: "",
  visible: false,
  setVisible: ()=> null,
}

export const PromptProviderContext = createContext(initialState);
const {Provider} = PromptProviderContext;

export const PromptProvider = ({children})=> {

  const [promptState,setPromptstate] = useState(initialState)

  const prompt = ({type, title, message, event, onPress = null })=> {
    setPromptstate({
      type,
      title,
      message,
      visible: true,
      event,
      setVisible: ()=>  setPromptstate(initialState),
      onPress: ()=> {
        setPromptstate(initialState)
        if(onPress){ onPress() }
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