import React , {useRef, useState , useContext , useEffect} from 'react';
import {StyleSheet,View,Text,ActivityIndicator} from 'react-native';
import {Separator} from 'toktokwallet/components';
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_ENTERPRISE_UPGRADE_REQUEST } from 'toktokwallet/graphql';
import { useQuery } from '@apollo/react-hooks';
import { SomethingWentWrong } from 'src/components';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    BottomSheetIDType,
    HeaderReminders,
    PendingRequest,
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
    const { setForms } = useContext(ContextEnterpriseApplication)
    const IDTypeRef = useRef()
    const [idIndex,setIDIndex] = useState(1)
    const onPress = (index)=> {
        setIDIndex(index)
        IDTypeRef.current.expand()
    }

    const {data ,error , loading } = useQuery(GET_ENTERPRISE_UPGRADE_REQUEST , {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    })

    if(loading){
        return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW} />
        </View>
        );
    }

    if(error){
        return <SomethingWentWrong/>
    }

    if(data?.getEnterpriseUpgradeRequest?.status == 2){
        return (
            <>
                <Separator/>
                <PendingRequest enterpriseRequest={data.getEnterpriseUpgradeRequest}/>
            </>
        )
    }

    if(data?.getEnterpriseUpgradeRequest?.status == 3){
    
        return (
            <>
            <Separator/>
            <SetRequestRecords data={data.getEnterpriseUpgradeRequest}/>
            <ScrollView style={styles.container}>
                <HeaderReminders/>
                <UploadForms/>
                <TakePhotoID onPress={onPress}/>
                </ScrollView>
                <Submit />
            <BottomSheetIDType ref={IDTypeRef} idIndex={idIndex} onChange={()=>null} />
            </>
        )
    }

    return (
        <>
        <Separator/>
        <ScrollView style={styles.container}>
            <HeaderReminders/>
            <UploadForms/>
            <TakePhotoID onPress={onPress}/>
        </ScrollView>
        <Submit />
        <BottomSheetIDType ref={IDTypeRef} idIndex={idIndex} onChange={()=>null} />
        </>
    )
}

export const ToktokWalletEnterpriseApplication = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Enterprise','']}/>,
    })
    return (

        <ContextProvider>
            <MainComponent/>
        </ContextProvider>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
})