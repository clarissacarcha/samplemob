import React , {useRef, useState , useContext , useEffect} from 'react';
import {StyleSheet,View,Text,ActivityIndicator,ScrollView} from 'react-native';
import {Separator} from 'toktokwallet/components';
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
    Submit,
    UploadForms,
    ContextEnterpriseApplication,
    TakePhotoID
} from "../../Components"

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

export const ApplicationComponent = ()=> {
    const { setForms , validID1, validID2 , pepInfo , setPepInfo } = useContext(ContextEnterpriseApplication)
    const IDTypeRef = useRef()
    const [idIndex,setIDIndex] = useState(1)
    const alert = useAlert();

    const onPress = (index)=> {
        setIDIndex(index)
        IDTypeRef.current.expand()
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
})