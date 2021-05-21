import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

const citiesList = [
    {"id": 1, "name": "Adams", "provCode": "0128"},	
{"id": 2, "name": "Bacarra", "provCode": "0128"},
{"id": 3, "name": "Badoc", "provCode": "0128"},
{"id": 4, "name": "Bangui", "provCode": "0128"},	
{"id": 6, "name": "Burgos", "provCode": "0128"},
{"id": 7, "name": "Carasi", "provCode": "0128"},
{"id": 8, "name": "Currimao", "provCode": "0128"},	
{"id": 9, "name": "Dingras", "provCode": "0128"},	
{"id": 10, "name": "Dumalneg", "provCode": "0128"},
{"id": 15, "name": "Pagudpud", "provCode": "0128"},	
{"id": 16, "name": "Paoay", "provCode": "0128"},
{"id": 17, "name": "Pasuquin", "provCode": "0128"},	
{"id": 18, "name": "Piddig", "provCode": "0128"},
{"id": 19, "name": "Pinili", "provCode": "0128"},
{"id": 21, "name": "Sarrat", "provCode": "0128"},	
{"id": 22, "name": "Solsona", "provCode": "0128"},	
{"id": 23, "name": "Vintar", "provCode": "0128"},	
{"id": 24, "name": "Alilem", "provCode": "0129"},	
{"id": 25, "name": "Banayoyo", "provCode": "0129"},	
{"id": 26, "name": "Bantay", "provCode": "0129"},
{"id": 27, "name": "Burgos", "provCode": "0129"},	
{"id": 28, "name": "Cabugao", "provCode": "0129"},
{"id": 52, "name": "Sigay", "provCode": "0129"},
{"id": 53, "name": "Sinait", "provCode": "0129"},	
{"id": 54, "name": "Sugpon", "provCode": "0129"},	
{"id": 55, "name": "Suyo", "provCode": "0129"},
{"id": 56, "name": "Tagudin", "provCode": "0129"},
{"id": 58, "name": "Agoo", "provCode": "0133"},
{"id": 59, "name": "Aringay", "provCode": "0133"},
{"id": 60, "name": "Bacnotan", "provCode": "0133"},	
{"id": 61, "name": "Bagulin", "provCode": "0133"},
{"id": 62, "name": "Balaoan", "provCode": "0133"},	
{"id": 63, "name": "Bangar", "provCode": "0133"},	
{"id": 64, "name": "Bauang", "provCode": "0133"},	
{"id": 65, "name": "Burgos", "provCode": "0133"},	
{"id": 66, "name": "Caba", "provCode": "0133"},
{"id": 67, "name": "Luna", "provCode": "0133"},
{"id": 69, "name": "Pugo", "provCode": "0133"},	
{"id": 70, "name": "Rosario", "provCode": "0133"},	
{"id": 75, "name": "Santol", "provCode": "0133"},	
{"id": 76, "name": "Sudipen", "provCode": "0133"},	
{"id": 77, "name": "Tubao", "provCode": "0133"},
{"id": 78, "name": "Agno", "provCode": "0155"},
{"id": 79, "name": "Aguilar", "provCode": "0155"},
{"id": 90, "name": "Binmaley", "provCode": "0155"},	
{"id": 91, "name": "Bolinao", "provCode": "0155"},
{"id": 92, "name": "Bugallon", "provCode": "0155"},	
{"id": 93, "name": "Burgos", "provCode": "0155"},
{"id": 94, "name": "Calasiao", "provCode": "0155"},
{"id": 96, "name": "Dasol", "provCode": "0155"},
{"id": 97, "name": "Infanta", "provCode": "0155"},
{"id": 98, "name": "Labrador", "provCode": "0155"},
{"id": 102, "name": "Manaoag", "provCode": "0155"},
{"id": 108, "name": "Rosales", "provCode": "0155"},
{"id": 118, "name": "Sison", "provCode": "0155"},
{"id": 119, "name": "Sual", "provCode": "0155"},
{"id": 120, "name": "Tayug", "provCode": "0155"},
{"id": 121, "name": "Umingan", "provCode": "0155"}
]

const VerifyContextProvider = ({children})=> {

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
    })
    const [contactInfo, setContactInfo] = useState({
        mobile_number: session.user.username,
        email: session.user.person.emailAddress
    })
    const [nationality,setNationality] = useState("Filipino")    
    const [birthInfo,setBirthInfo] = useState({
        birthdate: "",
        birthPlace: "",
    })
    const [address,setAddress] = useState({
        country: "Philippines",
        line1: "",
        line2: "",
        province: "",
        provinceId: null,
        city: "",
        cityId: null,
        zipCode: "",
        countryId: 175
    })
    const [verifyID, setVerifyID] = useState({
        idType: "",
        idImage: null,
        idCountry: "Philippines",
        idNumber: "",
        idID: ""
    })
    const [identificationId, setIdentificationId] = useState(null)

    const [selfieImage,setSelfieImage] = useState(null)
    const [frontImage, setFrontImage] = useState(null)
    const [backImage, setBackImage] = useState(null)

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

    const [cities, setCities] = useState(citiesList)
    const [provinceCities, setProvinceCities] = useState([])

    const changeProvinceCities = (data) => {
        setProvinceCities([...data])
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
                contactInfo,
                changeContactInfo,
                birthInfo,
                changeBirthInfo,
                address,
                changeAddress,
                verifyID,
                changeVerifyID,
                selfieImage,
                setSelfieImage,
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

                identificationId,
                setIdentificationId
 
            }}
        >
            {children}
        </Provider>
    )
}

export default VerifyContextProvider