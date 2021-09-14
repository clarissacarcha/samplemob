import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

const citiesList = []

export const VerifyContextProvider = ({children})=> {

    const session = useSelector(state=>state.session)

    const [modalCountryVisible,setModalCountryVisible] = useState(false)
    const [modalProvinceVisible,setModalProvinceVisible] = useState(false)
    const [modalCityVisible,setModalCityVisible] = useState(false)

    const [currentIndex,setCurrentIndex] = useState(0)
    const [fullname,setFullname] = useState(`${session.user.person.firstName} ${session.user.person.middleName ? session.user.person.middleName + " " : ""}${session.user.person.lastName}`)
    const [person,setPerson] = useState({
        firstName: session.user.person.firstName,
        middleName: session.user.person.middleName ? session.user.person.middleName : "",
        lastName: session.user.person.lastName,
        gender: "",
    })
    const [contactInfo, setContactInfo] = useState({
        mobile_number: session.user.username,
        email: session.user.person.emailAddress
    })
    const [nationality,setNationality] = useState("Filipino")
    const [nationalityId, setNationalityId] = useState(173)  // Default Philippines from database

    const [birthInfo,setBirthInfo] = useState({
        birthdate: "",
        birthPlace: "",
    })
    const [address,setAddress] = useState({
        country: "Philippines",
        line1: "",
        line2: "",
        postalCode: "",
        countryId: 175
    })

    const [incomeInfo, setIncomeInfo] = useState({
        source: "",
        otherSource: "",
        occupation: "",
    })

    const [province,setProvince] = useState("")
    const [provinceId,setProvinceId] = useState("")
    const [city,setCity] = useState("")
    const [cityId,setCityId] = useState("")

    const [verifyID, setVerifyID] = useState({
        idType: "",
        idImage: null,
        idCountry: "Philippines",
        idNumber: "",
        idID: ""
    })
    const [identificationId, setIdentificationId] = useState(null)

    const [selfieImage,setSelfieImage] = useState(null)
    const [tempSelfieImage,setTempSelfieImage] = useState(null)
    const [selfieImageWithID,setSelfieImageWithID] = useState(null)
    const [tempSelfieImageWithID,setTempSelfieImageWithID] = useState(null)
    const [frontImage, setFrontImage] = useState(null)
    const [backImage, setBackImage] = useState(null)
    const [isBackRequired, setIsbackRequired] = useState(false)
    const [cities, setCities] = useState(citiesList)
    const [provinceCities, setProvinceCities] = useState([])

    const changePersonInfo = (key,value)=> {
        person[key] = value
        setPerson(oldstate=>({
            ...oldstate,
        }))
    }

    const changeContactInfo = (key,value)=> {
        contactInfo[key] = value
        setContactInfo(oldstate=>({
            ...oldstate,
        }))
    }

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

    const changeProvinceCities = (data) => {
        setProvinceCities([...data])
    }

    const changeIncomeInfo = (key,value)=> {
        setIncomeInfo(oldstate=>({
            ...oldstate,
            [key]: value
        }))
    }


    // console.log("Context Provider", session.user.username)

    return (
        <Provider
            value={{
                currentIndex,
                setCurrentIndex,
                fullname,
                setFullname,
                nationality,
                setNationality,
                nationalityId,
                setNationalityId,
                contactInfo,
                changeContactInfo,
                birthInfo,
                changeBirthInfo,
                address,
                changeAddress,
                province,
                setProvince,
                provinceId,
                setProvinceId,
                city,
                setCity,
                cityId,
                setCityId,
                verifyID,
                changeVerifyID,
                selfieImage,
                setSelfieImage,
                tempSelfieImage,
                setTempSelfieImage,
                selfieImageWithID,
                setSelfieImageWithID,
                tempSelfieImageWithID,
                setTempSelfieImageWithID,
                person,
                changePersonInfo,
                modalCountryVisible,
                setModalCountryVisible,
                modalProvinceVisible,
                setModalProvinceVisible,
                modalCityVisible,
                setModalCityVisible,
                cities,
                setCities,
                provinceCities,
                changeProvinceCities,
                frontImage,
                setFrontImage,
                backImage,
                setBackImage,
                isBackRequired,
                setIsbackRequired,
                identificationId,
                setIdentificationId,
                incomeInfo,
                changeIncomeInfo,
            }}
        >
            {children}
        </Provider>
    )
}
