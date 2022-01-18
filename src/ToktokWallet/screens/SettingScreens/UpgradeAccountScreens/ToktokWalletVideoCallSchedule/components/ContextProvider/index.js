import React , {createContext , useState , useEffect} from 'react'

export const ContextChannelForm = createContext(null)
const { Provider } = ContextChannelForm
import {useLazyQuery,useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../../graphql'
import { GET_CALL_CHANNELS } from '../../../../../../graphql/model'
import { onErrorAlert } from '../../../../../../../util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
export const ContextProvider = ({ children })=> {

    const navigation = useNavigation();
    const [selectedCallChannel, setSelectedCallChannel] = useState({});
    const [callChannels, setCallChannels] = useState("");
    const [numberOrLink, setNumberOrLink] = useState("");
    const [dayPicked, setDayPicked] = useState({
        index: 0,
        min: 2,
        max: 6
    });
    const [timePicked, setTimePicked] = useState({
        index: 0,
        min: "08:00",
        max: "12:00"
    });
    const [errorMessage, setErrorMessage] = useState("");
    const alert = useAlert()
    
    const [getCallChannels] = useLazyQuery(GET_CALL_CHANNELS, {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error,navigation})
        },
        onCompleted:({getCallChannels})=> {
            setCallChannels(getCallChannels)
        }
    })

    useEffect(()=>{
        getCallChannels()
    },[])

    return (
        <Provider
            value={{
                callChannels,
                selectedCallChannel,
                setSelectedCallChannel,
                numberOrLink,
                setNumberOrLink,
                dayPicked,
                setDayPicked,
                timePicked,
                setTimePicked,
                errorMessage,
                setErrorMessage 
            }}
        >
            {children}
        </Provider>
    )
}
