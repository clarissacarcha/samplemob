import React , {useState , useRef , useEffect , useCallback } from 'react'
import { View , PanResponder , Alert } from 'react-native'
import { useNavigation , useFocusEffect } from '@react-navigation/native';
import { PromptModal } from '../Modals'


export const CheckIdleState = ({children})=> {

    const timerId = useRef(false);
    const [durationInSeconds,setDurationInSeconds] = useState(10);
    const [showPrompt,setShowPrompt] = useState(false)
    const navigation = useNavigation();
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: ()=> {
                // resetInactivityTimeout()
            }
        })
    );

    const resetInactivityTimeout = ()=> {
        clearTimeout(timerId.current)
        timerId.current = setTimeout(()=>{
            setShowPrompt(true)
        },(durationInSeconds * 1000))
    }

    const onPress = ()=> {
        setShowPrompt(false);
        return navigation.navigate("ToktokWalletLoginPage")
    }

    useFocusEffect(useCallback(()=> {
        // resetInactivityTimeout()
        return ()=> clearTimeout(timerId.current)
    },[timerId.current]))

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