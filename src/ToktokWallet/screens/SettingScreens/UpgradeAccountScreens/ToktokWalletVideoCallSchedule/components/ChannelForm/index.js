import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from "react-native";
import CONSTANTS from "common/res/constants";
import { ContextChannelForm } from "../../components";
import { CustomRadioButton } from "../../../../../../components";
import { YellowButton } from 'src/revamp';
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;


const DAY_LIST = [
    { label: "Weekday", value: 0 },
    { label: "Weekend", value: 1 }
];

const TIME_LIST = [
    { subLabel: "(Morning)", label: "8:00am - 12:00nn",  value: 0 },
    { subLabel: "(Afternoon)", label: "1:00pm - 5:00pm", value: 1 }
];

export const modifyPlaceholderAccordingToChannel = (channelName) => {
    switch (channelName) {
        case "Skype":
            return "Skype ID"
        case "Messenger":
            return "Messenger link"
    
        default:
            return `${channelName} number`;
    }
}

export const ChannelForm = ({ data }) => {

    const { channelName, contactDescription } = data
    const isMobileNumber = contactDescription == "number"
    const placeholder = modifyPlaceholderAccordingToChannel(channelName) 
    const {
        numberOrLink,
        setNumberOrLink,
        dayPicked,
        setDayPicked,
        timePicked,
        setTimePicked,
        errorMessage,
        setErrorMessage 
     } = useContext(ContextChannelForm)

     const onPressPickDay = (index) => {
        let data = {
            index,
            min: index ? 1 : 2,
            max: index ? 7 : 6
        }
        setDayPicked(data)
     }

     const onPressPickTime = (index) => {
        let data = {
            index,
            min: index ? "13:00" : "08:00",
            max: index ? "17:00" : "12:00"
        }
        setTimePicked(data)
     }


     const changeNumberOrLink = (value) => {
         if(isMobileNumber){
            let mobile = value.replace(/[^0-9]/g, "")

            if(mobile.length > 11) return
            if(value[0] != "0" || value[1] != "9" ){
                setNumberOrLink("09")
            }else{
                setNumberOrLink(mobile)
            }
         } else {
            setNumberOrLink(value)
         }
     }

    return (
        <>
            <TextInput
                keyboardType={isMobileNumber ? "number-pad" : "default"}
                value={numberOrLink}
                placeholder={`Enter ${placeholder} here...`}
                style={[styles.input, { borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED }]}
                onChangeText={(changeNumberOrLink)}
                returnKeyType="done"
            />
            {errorMessage != "" && <Text style={{ fontFamily:FONT.REGULAR, fontSize: FONT_SIZE.XS, color:"#F93154"}}>{errorMessage}</Text>}
            <Text style={{ marginTop: 15, marginBottom: 5, fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: "#9E9E9E" }} >Pick day and time</Text>
            <View style={{ borderWidth: 1, borderColor: "#DADADA", padding: 16 }} >
                <Text style={{ marginBottom: 10, fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M }} >Day:</Text>
                <CustomRadioButton
                    data={DAY_LIST}
                    selected={dayPicked.index}
                    onPress={onPressPickDay}
                />
                <View style={{ borderWidth: 1, borderColor: "#F4F4F4", marginVertical: 10 }} />
                <Text style={{ marginBottom: 10, fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M }} >Time:</Text>
                <CustomRadioButton
                    data={TIME_LIST}
                    selected={timePicked.index}
                    onPress={onPressPickTime}
                />
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