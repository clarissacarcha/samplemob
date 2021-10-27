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

export const ValidateRequirements = (context)=> {
    const {
        forms,
        setFileError,
        validID1,
        validID2,
        setValidID1,
        setValidID2,
    } = context

    let noError = true;
    if(forms[0].filename == ""){
        setFileError( 0 , "Business Permit is required.");
        noError = false;
    }
    if(forms[1].filename == ""){
        setFileError( 1 , "DTI Certification of Registration or SEC is required.");
        noError = false;
    }
    if(forms[2].filename == ""){
        setFileError( 2 , "BIR 2302 Form is required.");
        noError = false;
    }
    if(forms[3].filename == ""){
        setFileError( 3 , "Barangay Permit is required.");
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

    if(validID1.isBackRequired && validID1.backFilename == ""  && validID1.IDTypeDescription != ""){
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

    if(validID2.isBackRequired && validID2.backFilename == "" && validID2.IDTypeDescription != ""){
        setValidID2(state=>({...state,backErrorMessage:"Back Photo of your ID is required."}))
        noError = false;
    }

    // for(let x = 0 ; x < forms.length ; x++){
    //     if(forms[x].errorMessage != ""){
    //         noError = false;
    //         break;
    //     }
    // }

    return noError;
}

export const Submit = ()=> {
    const {
        forms,
        validID1,
        validID2,
        setFileError,
        setValidID1,
        setValidID2,
        pepInfo,
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

    const onPress = ()=> {
        const noError = ValidateRequirements({
            forms,
            setFileError,
            validID1,
            validID2,
            setValidID1,
            setValidID2,
        });
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
            pepQuestionnaire:{
                isPep: pepInfo.questionnaire.isPep,
                pepPosition: pepInfo.questionnaire.pepPosition,
                isFamilyPep: pepInfo.questionnaire.isFamilyPep,
                familyPepPosition: pepInfo.questionnaire.familyPepPosition,
                sourceOfIncomeId: pepInfo.questionnaire.sourceOfIncomeId,
                sourceOfIncome: pepInfo.questionnaire.sourceOfIncome,
                sourceOfWealthId: pepInfo.questionnaire.sourceOfWealthId,
                sourceOfWealth: pepInfo.questionnaire.sourceOfWealth
            }
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
                title="Success!"
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