import React , {useContext,useState} from 'react';
import { View , Text , StyleSheet } from 'react-native';
import { YellowButton } from 'src/revamp';
import { Separator , PromptModal } from 'toktokwallet/components';
import { ContextEnterpriseApplication } from "../ContextProvider";
import { TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import { POST_ENTERPRISE_UPGRADE_REQUEST } from 'toktokwallet/graphql';
import { useMutation } from '@apollo/react-hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { AlertOverlay } from 'src/components';
import { useAlert } from 'src/hooks';
import { useNavigation } from '@react-navigation/native';

export const Submit = ()=> {

    const {
        forms,
        setFileError,
        validID1,
        validID2,
        setValidID1,
        setValidID2,
    } = useContext(ContextEnterpriseApplication)
    const [visible,setVisible] = useState(false);
    const alert = useAlert();
    const navigation = useNavigation();

    const [postEnterpriseUpgradeRequest, {data , error ,loading }] = useMutation(POST_ENTERPRISE_UPGRADE_REQUEST, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({postEnterpriseUpgradeRequest})=> {
            // console.log(JSON.stringify(postEnterpriseUpgradeRequest))
            return setVisible(true) // Open Successful Modal Prompt
        }   
    })

    const ValidateID = ()=> {
        
    }

    const onPress = ()=> {
        let noError = true;
        if(forms[0].filename == ""){
            setFileError( 0 , "Business Permit");
            noError = false;
        }
        if(forms[1].filename == ""){
            setFileError( 1 , "DTI Certification of Registration");
            noError = false;
        }
        if(forms[2].filename == ""){
            setFileError( 2 , "BIR 2302 Form");
            noError = false;
        }
        if(forms[3].filename == ""){
            setFileError( 3 , "Barangay Permit");
            noError = false;
        }

        if(validID1.IDTypeDescription == ""){
            setValidID1(state=>({...state,frontErrorMessage:"Valid ID is required."}))
            noError = false;
        }

        if(validID1.frontFilename == "" && validID1.IDTypeDescription != ""){
            setValidID1(state=>({...state,frontErrorMessage:"Front Photo of your ID is required."}))
            noError = false;
        }

        if(validID1.isBackRequired && validID1.backFilename == ""){
            setValidID1(state=>({...state,backErrorMessage:"Back Photo of your ID is required."}))
            noError = false;
        }

        if(validID2.IDTypeDescription == ""){
            setValidID2(state=>({...state,frontErrorMessage:"Valid ID is required."}))
            noError = false;
        }

        if(validID2.frontFilename == "" && validID2.IDTypeDescription != ""){
            setValidID2(state=>({...state,frontErrorMessage:"Front Photo of your ID is required."}))
            noError = false;
        }

        if(validID2.isBackRequired && validID2.backFilename == ""){
            setValidID2(state=>({...state,backErrorMessage:"Back Photo of your ID is required."}))
            noError = false;
        }
        

        const input = {
            businessPermitFile: forms[0].file,
            dtiCrFile: forms[1].file,
            birFile: forms[2].file,
            barangayPermitFile: forms[3].file,
            firstIdentificationCardId: +validID1.IDType,
            firstGovtIdFront: validID1.frontFile,
            firstGovtIdBack: validID1.backFile,
            secondIdentificationCardId: +validID2.IDType,
            secondGovtIdFront: validID2.frontFile,
            secondGovtIdBack: validID2.backFile,
        }
        if(noError){
            postEnterpriseUpgradeRequest({
                variables: {
                    input: input
                }
            })
        }
       
    }

    const closeModal = ()=> {
        navigation.replace("ToktokWalletEnterpriseApplication");
        return setVisible(false);
    }

    return (
        <>
        <AlertOverlay visible={loading}/>
        <PromptModal 
                visible={visible} 
                onPress={closeModal}
                message="Your business documents have been submitted. These documents are for review and approval."
                title="Success !"
                event="success"
        />
        <View style={styles.container}>
            <YellowButton label="Submit" onPress={onPress}/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
       padding: 16,
       backgroundColor:"white"
    }
})