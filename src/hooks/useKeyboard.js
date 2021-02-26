import React , {useEffect , useState} from 'react'
import {Keyboard} from 'react-native'

export const useKeyboard = ()=> {

    const [keyboardHeight,setKeyboardHeight] = useState(0)

    const onKeyboardShow = (e) => {
        console.log(e)
        setKeyboardHeight(e.endCoordinates.height)
    }

    const onKeyboardHide = (e)=> {
        console.log(e)
    }

    useEffect(()=>{
        Keyboard.addListener('keyboardDidShow', onKeyboardShow)
        Keyboard.addListener('keyboardDidHide', onKeyboardHide)
    },[])
    
    return {
        keyboardHeight: keyboardHeight
    }
}

