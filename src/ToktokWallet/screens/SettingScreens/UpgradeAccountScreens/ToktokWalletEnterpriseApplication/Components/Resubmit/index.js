import React , {useContext,useState} from 'react';
import { View , Text , StyleSheet } from 'react-native';
import { YellowButton } from 'src/revamp';
import { Separator , PromptModal} from 'toktokwallet/components';
import { ContextEnterpriseApplication } from "../ContextProvider";
import { TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import { PATCH_ENTERPRISE_UPGRADE_REQUEST } from 'toktokwallet/graphql';
import { useMutation } from '@apollo/react-hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { AlertOverlay } from 'src/components';
import { useAlert } from 'src/hooks';
import { useNavigation } from '@react-navigation/native'


export const Resubmit = ({id})=> {

    const {
        forms,
        setFileError,
        validID1,
        validID2,
    } = useContext(ContextEnterpriseApplication)
    const [visible,setVisible] = useState(false);
    const alert = useAlert();
    const navigation = useNavigation();

    const [patchEnterpriseUpgradeRequest, {data , error ,loading }] = useMutation(PATCH_ENTERPRISE_UPGRADE_REQUEST, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({patchEnterpriseUpgradeRequest})=> {
            // console.log(JSON.stringify(postEnterpriseUpgradeRequest))
            if(patchEnterpriseUpgradeRequest.result){
                return setVisible(true) // Open Successful Modal Prompt
            }
        }   
    })

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

        const input = {
            id: id,
            businessPermitFile: forms[0].file,
            businessPermitFileName: forms[0].filename,
            dtiCrFile: forms[1].file,
            dtiCrFileName: forms[1].filename,
            birFile: forms[2].file,
            birFileName: forms[2].filename, 
            barangayPermitFile: forms[3].file,
            barangayPermitFileName: forms[3].filename,
            firstIdentificationCardId: +validID1.IDType,
            firstGovtIdFront: validID1.frontFile,
            firstGovtIdFrontName: validID1.frontFilename,
            firstGovtIdBack: validID1.backFile,
            firstGovtIdBackName: validID1.backFilename,
            secondIdentificationCardId: +validID2.IDType,
            secondGovtIdFront: validID2.frontFile,
            secondGovtIdFrontName: validID2.frontFilename,
            secondGovtIdBack: validID2.backFile,
            secondGovtIdBackName: validID2.backFilename 
        }
        if(noError){
            patchEnterpriseUpgradeRequest({
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
                message=""
                title=""
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