import React , {useRef, useState , useContext , useEffect} from 'react';
import {StyleSheet,View,Text,ActivityIndicator,ScrollView} from 'react-native';
import {Separator} from 'toktokwallet/components';
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
    ApplicationComponent,
    PepQuestionnaire,
    ContextProvider,
    ContextEnterpriseApplication,
    BottomSheetIDType,
    HeaderReminders,
    PendingRequest,
    Resubmit,
    SetRequestRecords,
    UploadForms,
    TakePhotoID
} from "./Components"

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS


export const ToktokWalletEnterpriseApplication = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Enterprise','']}/>,
    })

    const MainComponent = ()=> {
        const { currentIndex } = useContext(ContextEnterpriseApplication);
        const [screens,setScreens] = useState([
            <PepQuestionnaire/>,
            <ApplicationComponent/>
        ])
        const { setForms , validID1, validID2 , pepInfo , setPepInfo } = useContext(ContextEnterpriseApplication)
        const IDTypeRef = useRef()
        const [idIndex,setIDIndex] = useState(1)
        const alert = useAlert();
    
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
            <View style={{flex: 1}}>
                 <View style={styles.progressBar}>
                    {screens.map((item, index) => {
                        if (index < screens.length)
                        return (
                            <View
                            style={[styles.progressBarItem, {backgroundColor: index <= currentIndex ? '#F6841F' : 'transparent'}]}
                            />
                        );
                    })}
                 </View>
                {screens[currentIndex]}
            </View>
        )
    }
    return (
        <>
            <ContextProvider>
                <MainComponent/>
            </ContextProvider>
        </>
    )
}

const styles = StyleSheet.create({
    progressBar: {
        height: 10,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FFF1D2',
    },
    progressBarItem: {
        flex: 1,
    },
})
