import React , {useRef, useState , useContext , useEffect} from 'react';
import {StyleSheet,View,Text,ActivityIndicator} from 'react-native';
import {Separator,CheckIdleState,PepQuestionnaireModal} from 'toktokwallet/components';
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_ENTERPRISE_UPGRADE_REQUEST } from 'toktokwallet/graphql';
import { useQuery , useLazyQuery } from '@apollo/react-hooks';
import { SomethingWentWrong } from 'src/components';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
import {AlertOverlay} from 'src/components';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    BottomSheetIDType,
    HeaderReminders,
    PendingRequest,
    Resubmit,
    SetRequestRecords,
    Submit,
    UploadForms,
    ContextProvider,
    ContextEnterpriseApplication,
    TakePhotoID
} from "./Components"
import { ScrollView } from 'react-native-gesture-handler';

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS


const MainComponent = ()=> {
    const { setForms , validID1, validID2 } = useContext(ContextEnterpriseApplication)
    const IDTypeRef = useRef()
    const [idIndex,setIDIndex] = useState(1)
    const alert = useAlert();
    const [showPepQuestionnaire,setShowPepQuestionnaire] = useState(true)

    const onPress = (index)=> {
        setIDIndex(index)
        IDTypeRef.current.expand()
    }

    const {data , error ,loading } = useQuery(GET_ENTERPRISE_UPGRADE_REQUEST , {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error,navigation})
    })

    if(loading){
        return <AlertOverlay visible={loading}/>
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    if(data?.getEnterpriseUpgradeRequest?.status == 2 || data?.getEnterpriseUpgradeRequest?.status == 5){
        return (
            <>
                <Separator/>
                <PendingRequest enterpriseRequest={data?.getEnterpriseUpgradeRequest}/>
            </>
        )
    }

    if(data?.getEnterpriseUpgradeRequest?.status == 3){
        // Status is for compliance
        return (
            <>
            <Separator/>
            <SetRequestRecords data={data?.getEnterpriseUpgradeRequest}/>
            <ScrollView style={styles.container}>
                <HeaderReminders/>
                <UploadForms/>
                <TakePhotoID onPress={onPress}/>
                </ScrollView>
                <Resubmit id={data?.getEnterpriseUpgradeRequest?.id}/>
                <BottomSheetIDType 
                    ref={IDTypeRef} 
                    idIndex={idIndex} 
                    onChange={()=>null}
                    validID1={validID1}
                    validID2={validID2}
                />
            </>
        )
    }


    return (
        <>
        <PepQuestionnaireModal 
            visible={showPepQuestionnaire} 
            setVisible={setShowPepQuestionnaire}
            pepInfo={pepInfo}
            setPepInfo={setPepInfo}
            onRequestClose={()=>navigation.pop()}
            callback={()=>{
                setShowPepQuestionnaire(false)
            }}
        />
        <Separator/>
        <ScrollView style={styles.container}>
            <HeaderReminders/>
            <UploadForms/>
            <TakePhotoID onPress={onPress}/>
        </ScrollView>
        <Submit />
        <BottomSheetIDType 
            ref={IDTypeRef} 
            idIndex={idIndex} 
            onChange={()=>null}
            validID1={validID1}
            validID2={validID2}
        />
        </>
    )

}

export const ToktokWalletEnterpriseApplication = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Enterprise','']}/>,
    })
    return (
        <>
            <ContextProvider>
                <MainComponent/>
            </ContextProvider>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
})