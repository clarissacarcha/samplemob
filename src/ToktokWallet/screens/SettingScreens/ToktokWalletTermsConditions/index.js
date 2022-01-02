import React , {useRef} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image,ActivityIndicator,ScrollView} from 'react-native'
import {YellowButton,HeaderBack, HeaderTitle, } from 'src/revamp';
import { Separator, CheckIdleState } from 'toktokwallet/components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_GLOBAL_SETTING} from 'toktokwallet/graphql'
import {useQuery} from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import CONSTANTS from 'common/res/constants'
import { SomethingWentWrong } from 'src/components';
import WebView from 'react-native-webview'

const { FONT_FAMILY: FONT , FONT_SIZE , MARGIN , COLOR } = CONSTANTS

export const ToktokWalletTermsConditions = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Terms and Conditions', '']} />,
    });

    const webviewRef = useRef()
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
            onErrorAlert({alert,error,navigation})
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }

    if(error){
        return <SomethingWentWrong/>
    }

    return (
        <CheckIdleState>
        <Separator/>
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
                <Text style={styles.textValue}>{data.getGlobalSetting.keyValue}</Text>
            </ScrollView>
        </View>
        </CheckIdleState>
    )
}

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
        margin: MARGIN.M,
        textAlign: 'justify',
    },
    textValue:{
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
    }
})
