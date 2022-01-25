import React , {createContext , useState , useEffect} from 'react'
import {useSelector} from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_BANKS,POST_CASH_OUT_OTHER_BANKS} from 'toktokwallet/graphql'
import {useLazyQuery,useMutation} from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert, usePrompt } from 'src/hooks'

export const ContextCashOut = createContext(null)
const {Provider} = ContextCashOut


export const ContextProvider = ({children})=> {
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [bank,setBank] = useState({
        id: null,
        name: "",
    })
    const navigation = useNavigation();
    const tokwaName = `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`

    const [accountName,setAccountName] = useState("")
    const [accountNumber,setAccountNumber] = useState("")
    const [address,setAddress] = useState("")
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [savedAccounts,setSaveAccounts] = useState([])
    const [banks,setBanks] = useState([])
    const [activeAccount,setActiveAccount] = useState(null)
    const alert = useAlert()


    const [getBanks] = useLazyQuery(GET_BANKS, {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error,navigation})
        },
        onCompleted:({getBanks})=> {
        console.log("GETTING BANKS")
            setBanks(getBanks)
        }
    })

    useEffect(()=>{
        getBanks()
    },[])

    return (
        <Provider
            value={{
                bank,
                setBank,
                accountName,
                setAccountName,
                accountNumber,
                setAccountNumber,
                address,
                setAddress,
                amount,
                setAmount,
                note,
                setNote,
                savedAccounts,
                setSaveAccounts,
                banks,
                setBanks,
                activeAccount,
                setActiveAccount,
                tokwaAccount
            }}
        >
            {children}
        </Provider>
    )
}
