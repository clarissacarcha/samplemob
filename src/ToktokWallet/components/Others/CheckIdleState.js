import React , {useState , useRef , useEffect , useCallback } from 'react'
import { View , PanResponder , Alert } from 'react-native'
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';
import { PromptModal } from '../Modals'
import { useKeyboard , useAccount } from 'toktokwallet/hooks'
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';

export const CheckIdleState = ({children})=> {

    const timerId = useRef(false);
    const [durationInSeconds,_] = useState((60 * 5));
    const idleDurationInSeconds = 10;
    const activeTime = useRef(new Date())
    const [showPrompt,setShowPrompt] = useState(false)
    const navigation = useNavigation();
    const { tokwaAccount } = useAccount();
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
        BackgroundTimer.clearTimeout(timerId.current)
        timerId.current = null
        timerId.current = BackgroundTimer.setTimeout(()=>{
            setShowPrompt(true)
        },(durationInSeconds * 1000))
    }

    const resetIdleActivity = async ()=> {
        const lastActiveDateTIme = moment(activeTime.current);
        var duration = moment().diff(lastActiveDateTIme,'seconds');
        if(duration >= idleDurationInSeconds){
            return setShowPrompt(true)
        }
        return activeTime.current = new Date();
    }

    const onPress = ()=> {
       
        if(tokwaAccount.events.cashInTopUp){
            navigation.navigate("ToktokWalletPaymentOptions");
            navigation.pop();
            setShowPrompt(false);
            return;
        }
        setTimeout(()=>{
            navigation.navigate("ToktokWalletLoginPage")
            navigation.replace("ToktokWalletLoginPage")
            setShowPrompt(false);
            return;
        },1000)

        return;
    }

    // useEffect(()=>{
    //     resetInactivityTimeout();
    //     return ()=> {
    //         clearTimeout(timerId.current)
    //         console.log("CLEARING ACTIVE TIME AND LEAVING SCREEN")
    //     }
    // },[])

    useFocusEffect(useCallback(()=> {
        resetInactivityTimeout();
        return ()=> {
            BackgroundTimer.clearTimeout(timerId.current)
            timerId.current = null
        }
    },[]))


    return (
        <>
            <PromptModal 
                visible={showPrompt}
                event="warning"
                message="You have been logged out from toktokwallet due to inactivity."
                title="Logged Out!"
                onPress={onPress}
            />
            <View style={{flex: 1}} {...panResponder.current.panHandlers}>
                {children}
            </View>
        </>
    )
}