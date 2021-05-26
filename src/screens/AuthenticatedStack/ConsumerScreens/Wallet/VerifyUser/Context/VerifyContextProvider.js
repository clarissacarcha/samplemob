import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

const VerifyContextProvider = ({children})=> {

    const session = useSelector(state=>state.session)

    const [modalCountryVisible,setModalCountryVisible] = useState(false)
    const [currentIndex,setCurrentIndex] = useState(0)
    const [fullname,setFullname] = useState(`${session.user.person.firstName} ${session.user.person.middleName ? session.user.person.middleName + " " : ""}${session.user.person.lastName}`)
    const [nationality,setNationality] = useState("Philippines")
    const [birthInfo,setBirthInfo] = useState({
        birthdate: "",
        birthPlace: "",
    })
    const [address,setAddress] = useState({
        country: "Philippines",
        streetAddress: "",
        village: "",
        city: "",
        region: "",
        zipCode: ""
    })


    const [verifyID, setVerifyID] = useState({
        idType: "",
        idImage: null,
        idCountry: "Philippines",
        idNumber: "",
    })
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

    const changeVerifyID = (key,value) => {
        verifyID[key] = value
        setVerifyID(oldstate=>({
            ...oldstate
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
                verifyID,
                changeVerifyID,
                selfieImage,
                setSelfieImage,
                modalCountryVisible,
                setModalCountryVisible,
            }}
        >
            {children}
        </Provider>
    )
}

export default VerifyContextProvider