import React, {createContext,useState} from 'react'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

const VerifyContextProvider = ({children})=> {

    const [currentIndex,setCurrentIndex] = useState(0)
    const [fullname,setFullname] = useState("")
    const [nationality,setNationality] = useState("")
    const [birthInfo,setBirthInfo] = useState({
        birthdate: "",
        birthPlace: "",
    })
    const [address,setAddress] = useState({
        country: "",
        streetAddress: "",
        village: "",
        city: "",
        region: "",
        zipCode: ""
    })
    const [idImage,setIDImage] = useState(null)
    const [selfieImage,setSelfieImage] = useState(null)

    const changeBirthInfo = (key,value)=> {
        birthInfo[key] = value
        setBirthInfo(oldstate=>({
            ...oldstate,
        }))
    }

    const changeAddress = (key,value)=> {
        address[key] = value
        setAddress(oldstate=>({
            ...oldstate,
        }))
    }

    return (
        <Provider
            value={{
                currentIndex,
                setCurrentIndex,
                fullname,
                setFullname,
                nationality,
                setNationality,
                birthInfo,
                changeBirthInfo,
                address,
                changeAddress,
                idImage,
                setIDImage,
                selfieImage,
                setSelfieImage,
            }}
        >
            {children}
        </Provider>
    )
}

export default VerifyContextProvider