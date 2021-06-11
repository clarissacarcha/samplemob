import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image,ActivityIndicator,ScrollView} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {YellowButton,HeaderBack, HeaderTitle, } from '../../../../../../../revamp';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../../res/variables';
import { Separator } from '../../../Components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../../graphql'
import {GET_GLOBAL_SETTING} from '../../../../../../../graphql/toktokwallet'
import {useQuery} from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../../hooks'

const TermsConditionsScreen = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Terms and Conditions', '']} />,
    });

    const alert = useAlert()

    const {data,error,loading} = useQuery(GET_GLOBAL_SETTING, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        variables: {
            input: {
                settingKey: "tokwaTermsAndCondition"
            }
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                    <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }

    if(!data.getGlobalSetting){
        return null
    }

    if(error){
        return null
    }

    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                <Text>{data.getGlobalSetting.keyValue}</Text>
            </ScrollView>
        </View>
        </>
    )
}

export default TermsConditionsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE,
    },
    checkIcon: {
        height: 98,
        width: 98,
        backgroundColor: COLOR.YELLOW,
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },  
    titleText: {
        marginTop: 17,
        fontSize: FONT_SIZE.XL,
        fontFamily: FONT.BOLD,
    },
    actionBtn: {
        height: 70,
        padding: 16,
        justifyContent:"flex-end",
        marginBottom: Platform.OS == "ios" ? 25 : 0
    },
    body: {
        margin: SIZE.MARGIN,
        textAlign: 'justify',
      },
})
