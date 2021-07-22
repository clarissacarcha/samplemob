import React , {createContext , useState , useEffect} from 'react'

export const ContextChannelForm = createContext(null)
const { Provider } = ContextChannelForm

export const ContextProvider = ({ children })=> {

    const [selectedChannel, setSelectedChannel] = useState("");
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

    return (
        <Provider
            value={{
                selectedChannel,
                setSelectedChannel,
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
