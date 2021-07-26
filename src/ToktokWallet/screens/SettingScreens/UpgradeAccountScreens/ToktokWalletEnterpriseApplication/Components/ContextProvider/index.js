import React , {createContext , useState } from 'react'
import {ReactNativeFile} from 'apollo-upload-client';

export const ContextEnterpriseApplication = createContext(null)
const { Provider } = ContextEnterpriseApplication


export const ContextProvider = ({children}) => {

    const [forms,setForms] = useState([
        {name: "Business Permit", file: null , filename: "" , errorMessage: ""},
        {name: "DTI Certification of Registration", file: null, filename: "", errorMessage: ""},
        {name: "BIR 2302 Form", file: null , filename: "", errorMessage: ""},
        {name: "Barangay Permit", file: null, filename: "", errorMessage: ""},
    ])

    const [validID1 , setValidID1] = useState({
        name: "",
        frontFilename: "",
        frontFile: null,
        backFilename: "",
        backFile: null,
        IDType: "",
        IDTypeDescription:"",
        isBackRequired: 1,
    })

    const [validID2, setValidID2]  = useState({
        name: "",
        frontFilename: "",
        frontFile: null,
        backFilename: "",
        backFile: null,
        IDType: "",
        IDTypeDescription:"",
        isBackRequired: 1,
    })

    const setFileUpload = (index,value)=> {
        const rnFile = new ReactNativeFile({
            ...value,
            name: value.name,
            type: value.type,
        });
        setForms(state=> {
            const updateState = state[index]
            updateState.file = rnFile
            updateState.filename = value.name 
            updateState.errorMessage = ""
            return [...state]
        })
    }

    const setFileError = (index , fileName)=> {
        setForms(state=> {
            const updateState = state[index]
            updateState.errorMessage = `${fileName} is required.`
            return [...state]
        })
    }

    return (
        <Provider
            value={{
                forms,
                setFileUpload,
                setFileError,
                validID1,
                setValidID1,
                validID2,
                setValidID2
            }}
        >
            {children}
        </Provider>
    )
}