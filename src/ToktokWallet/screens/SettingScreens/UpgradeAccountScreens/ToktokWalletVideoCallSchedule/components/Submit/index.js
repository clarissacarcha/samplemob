import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from "react-native";
import CONSTANTS from "common/res/constants";
import { ContextChannelForm, modifyPlaceholderAccordingToChannel } from "../../components";
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_FULL_VERIFIED_UPGRADE_REQUEST } from 'toktokwallet/graphql';
import { useMutation } from '@apollo/react-hooks';
import { useAlert } from 'src/hooks/useAlert';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useSelector } from 'react-redux';
import { YellowButton } from 'src/revamp';
import {AlertOverlay} from 'src/components';
import {useNavigation} from '@react-navigation/native';
import { SuccessfulModal } from "../../../../../../components";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

export const Submit = () => {

    const navigation = useNavigation()
    const alert = useAlert()
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const {
        selectedCallChannel,
        numberOrLink,
        setNumberOrLink,
        dayPicked,
        setDayPicked,
        timePicked,
        setTimePicked,
        errorMessage,
        setErrorMessage
     } = useContext(ContextChannelForm)

     useEffect(()=>{
        if(numberOrLink){
            setErrorMessage("")
        }
    },[numberOrLink])

    useEffect(()=>{
        resetFields()
    },[selectedCallChannel])

    const resetFields = () => {
        setNumberOrLink("")
        setErrorMessage("")
        setDayPicked({
            index: 0,
            min: 2,
            max: 6
        })
        setTimePicked({
            index: 0,
            min: "08:00",
            max: "12:00"
        })
    }

    const [postFullyVerifiedUpgradeRequest,{ data, error, loading}] = useMutation(POST_FULL_VERIFIED_UPGRADE_REQUEST, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error) => {
            onErrorAlert({alert , error , navigation});
        },
        onCompleted: (response)=> {
            let result = response.postFullyVerifiedUpgradeRequest
            if(result.requestStatus == 2){
                navigation.pop(2)
                navigation.navigate("ToktokWalletFullyVerifiedApplication", { doneVcs: true })
            }
        }
    })

    const onPressSubmit = () => {
        let noError = true;
        let { channelName } = selectedCallChannel
        let placeholder = modifyPlaceholderAccordingToChannel(channelName);
        let isMobileNumber = channelName == "Viber" || channelName == "Whats App" || channelName == "Telegram"
        if(numberOrLink !== ""){
            if(isMobileNumber){
                if(numberOrLink.length === 11){
                    setErrorMessage("")
                    noError = true
                } else {
                    setErrorMessage("Mobile number must be valid.")
                    noError = false
                }
            }
        } else {
            setErrorMessage(`${placeholder} is required.`)
            noError = false
        }

        if(!noError) return

        let input = {
            accountTypeId: +tokwaAccount.person.accountType.level,
            videoCallContactDetails: isMobileNumber ? numberOrLink.replace("0", "+63") : numberOrLink,
            callChannelId: selectedCallChannel.id,
            preferredVcsDayMin: dayPicked.min,
            preferredVcsDayMax: dayPicked.max,
            preferredVcsTimeMin: timePicked.min,
            preferredVcsTimeMax: timePicked.max
        }

        postFullyVerifiedUpgradeRequest({
            variables: {
                input
            }
        })
    }

    return (
        <>
            <AlertOverlay visible={loading} />
            <View style={{ padding: 16 }}>
                <YellowButton label="Submit" onPress={onPressSubmit} />
            </View>
        </>
        
    )
}


const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 15,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR,
    },
})