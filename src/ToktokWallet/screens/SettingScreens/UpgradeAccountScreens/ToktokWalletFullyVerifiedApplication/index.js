import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Separator } from 'toktokwallet/components'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import {useSelector} from 'react-redux'
import { NotFinishRequirement, FinishRequirement } from './components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CHECK_FULLY_VERIFIED_UPGRADE_REQUEST, GET_CHECK_PENDING_DISBURSEMENT_ACCOUNT } from 'toktokwallet/graphql'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import {SomethingWentWrong} from 'src/components'
import { SuccessfulModal } from "../../../../components";
import { useDispatch } from 'react-redux'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT, SHADOW  } = CONSTANTS

const DisplayComponent = ({ finishLabel, notFinishLabel, title, btnLabel, onPress, disabled }) => {
    if(disabled){
        return (
            <FinishRequirement finishLabel={finishLabel} />
        )
    }
    return (
        <NotFinishRequirement
            notFinishLabel={notFinishLabel}
            btnLabel={btnLabel}
            onPress={onPress}
        />
    )
}
export const ToktokWalletFullyVerifiedApplication = ({navigation, route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Fully Verified','']}/>
    })

    const alert = useAlert()
    const [isLinkedBankAccount, setIsLinkedBankAccount] = useState(false)
    const [isPendingLinking,setIsPendingLinking] = useState(false)
    const [checkVcs, setCheckVcs] = useState({
        hasVcs: false,
        isPendingVcs: false
    })
    const [isLinked, setIsLinked] = useState(false)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [mounted, setMounted] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const dispatch = useDispatch()

    const [checkHasVcs, { error: errorCheckVcs, loading: loadingCheckVcs }] = useLazyQuery(GET_CHECK_FULLY_VERIFIED_UPGRADE_REQUEST, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted:({ getCheckFullyVerifiedUpgradeRequest })=> {
            let { hasVcs, isPendingVcs } = getCheckFullyVerifiedUpgradeRequest;
            setCheckVcs({ hasVcs, isPendingVcs });
        }
    })

    const [ getCheckPendingDisbursementAccount, { error: errorCheckPendingDisbursement, loading: loadingCheckPendingDisbursement }] = useLazyQuery(GET_CHECK_PENDING_DISBURSEMENT_ACCOUNT, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted:({ getCheckPendingDisbursementAccount })=> {
            setIsPendingLinking(getCheckPendingDisbursementAccount.result)
        }
    })

    const checkHasLinkBankAccount = () => {
        tokwaAccount.isLinked ? setIsLinkedBankAccount(true) : getCheckPendingDisbursementAccount()
    }

    useEffect(() => {
        checkHasLinkBankAccount()
        checkHasVcs()
        if(route.params){
            setShowSuccessModal(route.params.doneVcs)
        }
    }, [])

    const redirectLinking = ()=> {
        dispatch({
            type: "SET_TOKWA_EVENTS_REDIRECT",
            payload: {
                event: "upgradeAccount",
                value: true,
            }
        })
        return navigation.navigate("ToktokWalletCashOutHomePage")
    }

    if(loadingCheckVcs || loadingCheckPendingDisbursement){
        return (
            <View style={styles.activityIndicator}>
                <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }

    if(errorCheckVcs || errorCheckPendingDisbursement){
        return <SomethingWentWrong />;
    }

    return (
        <>
        <SuccessfulModal
            visible={showSuccessModal}
            title="Success!"
            description={`Your schedule has been submitted.\nPlease wait for our representative to\nget in touch with you`}
            redirect={() => { setShowSuccessModal(false) }}
        />
        <View style={{ backgroundColor:"#F7F7FA", padding: 16 }}>
            <Text>
                <Text style={styles.fontRegularStyle} >Meet the following requirements for upgrading your account to </Text>
                <Text style={{ color: "#00C851" }}>Fully Verified</Text>
            </Text>
        </View>
        <View style={styles.container}>
            <DisplayComponent
                onPress={redirectLinking} // Navigate here the screen for link bank account
                disabled={isLinkedBankAccount || isPendingLinking}
                notFinishLabel="Link your toktokwallet account to one bank account or another debit card."
                btnLabel="Link Now"
                finishLabel={
                    isLinkedBankAccount 
                    ? "Your application has been approved. Your Disbursement Account has been verified."
                    : "Your application has been submitted. Please wait for your Disbursement Account to be verified within 5 business days."
                }
            />
            <DisplayComponent
                onPress={() => { navigation.navigate("ToktokWalletVideoCallSchedule") }}
                disabled={checkVcs.hasVcs}
                notFinishLabel="Request a video call for verification"
                btnLabel="Schedule Now"
                finishLabel={
                    checkVcs.isPendingVcs
                    ? "Your schedule has been submitted. Please wait for our representative to get in touch with you within 5 business days."
                    : "Your video call requirement has been approved."
                }
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16
    },
    fontRegularStyle: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },
    activityIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})