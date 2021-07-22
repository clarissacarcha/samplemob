import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from "react-native";
import CONSTANTS from "common/res/constants";
import { ContextChannelForm, modifyPlaceholderAccordingToChannel } from "../../components";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;
import { YellowButton } from 'src/revamp'

export const Submit = () => {

    const {
        selectedChannel,
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
    },[selectedChannel])

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

    const onPressSubmit = () => {
        let noError = true;
        let placeholder = modifyPlaceholderAccordingToChannel(selectedChannel);
        let isMobileNumber = selectedChannel == "Viber" || selectedChannel == "Whats App" || selectedChannel == "Telegram"
        if(numberOrLink == ""){
            setErrorMessage(`${placeholder} is required.`)
            noError = false
        } else {
            if(isMobileNumber){
                numberOrLink.length === 11 ? setErrorMessage("") : setErrorMessage("Mobile number must be valid.")
            }
        }

        if(!noError) return
    }

    return (
        <View style={{ padding: 16 }}>
            <YellowButton label="Submit" onPress={onPressSubmit} />
        </View>
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