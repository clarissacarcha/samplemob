import React , {useState , useRef , useEffect , useCallback } from 'react'
import { View , PanResponder , Alert } from 'react-native'
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';
import { PromptModal } from '../Modals'
import { useKeyboard } from 'toktokwallet/hooks'


export const CheckIdleState = ({children})=> {

    const timerId = useRef(false);
    const [durationInSeconds,setDurationInSeconds] = useState(60);
    const [showPrompt,setShowPrompt] = useState(false)
    const navigation = useNavigation();
    // const isOpen = useKeyboard();
    // const route = useRoute();
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: ()=> {
                resetInactivityTimeout()
            }
        })
    );

    const resetInactivityTimeout = ()=> {
        console.log("RUNNING TIMER HERE")
        clearTimeout(timerId.current)
        timerId.current = null
        timerId.current = setTimeout(()=>{
            setShowPrompt(true)
        },(durationInSeconds * 1000))
    }

    const onPress = ()=> {
        setShowPrompt(false);
        return navigation.navigate("ToktokWalletLoginPage")
    }

    useFocusEffect(useCallback(()=> {
        resetInactivityTimeout();
        return ()=> {
            clearTimeout(timerId.current)
            timerId.current = null
            console.log("CLEARING TIMER AND LEAVING SCREEN")
        }
    },[]))

    // useEffect(()=>{
    //     if(isOpen){
    //         return clearTimeout(timerId.current)
    //     }else{
    //         resetInactivityTimeout() 
    //     }
    // },[isOpen])

    return (
        <>
            <PromptModal 
                visible={showPrompt}
                event="warning"
                message="You have been logout from toktokwallet due to inactivity."
                title="Logged Out!"
                onPress={onPress}
            />
            <View style={{flex: 1}} {...panResponder.current.panHandlers}>
                {children}
            </View>
        </>
    )
}