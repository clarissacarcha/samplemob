import React , {useContext , useEffect , useState} from 'react'
import { ContextEnterpriseApplication } from "../ContextProvider"

//SELF IMPORTS
import ForCompliancePrompt from "./ForCompliancePrompt";

export const SetRequestRecords = ({data})=> {

    const { setForms , setValidID1, setValidID2 } = useContext(ContextEnterpriseApplication)
    const [showModal,setShowModal] = useState(false)

    const explodeFilename = (value)=> {
        const filename = value.split("/")
        return filename[filename.length - 1]
    }

    useEffect(()=>{
        setForms(state=> {
            // BUSINESS PERMIT
            const businessPermit = state[0]
            businessPermit.filename = explodeFilename(data.businessPermitFile)

            // DTI CR
            const dtiCr = state[1]
            dtiCr.filename = explodeFilename(data.dtiCrFile)

            // BIR
            const bir = state[2]
            bir.filename = explodeFilename(data.birFile)

            // BARANGAY PERMIG
            const barangayPermit = state[3]
            barangayPermit.filename = explodeFilename(data.barangayPermitFile)

            return [...state]
        })

        setValidID1(state=> {
            return {
                ...state,
                frontFilename: data.firstGovtIdFront,
                ...(data.firstGovtIdBack ? {backFilename: data.firstGovtIdBack}: {}),
                isBackRequired: data.firstIDType.isBackRequired,
                IDTypeDescription: data.firstIDType.name,
                IDType: data.firstIDType.id,
            }
        })

        setValidID2(state=> {
            return {
                ...state,
                frontFilename: data.secondGovtIdFront,
                ...(data.secondGovtIdBack ? {backFilename: data.secondGovtIdBack}: {}),
                isBackRequired: data.secondIDType.isBackRequired,
                IDTypeDescription: data.secondIDType.name,
                IDType: data.secondIDType.id,
            }
        })

        setShowModal(true);
    },[])

    return <ForCompliancePrompt data={data} visible={showModal} setVisible={setShowModal}/>
}