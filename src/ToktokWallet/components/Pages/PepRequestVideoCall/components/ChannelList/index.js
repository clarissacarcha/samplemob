import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, Animated } from "react-native";
import { HeaderBack , HeaderTitle} from 'src/revamp';
import CONSTANTS from "common/res/constants";
import { ChannelForm, ContextChannelForm } from "../../components";
import { YellowButton } from 'src/revamp';
import {
    messenger,
    skype,
    telegram,
    viber,
    whatsApp
} from "toktokwallet/assets/icons/contacts-platform"

const staticLogo = [
    viber,
    whatsApp,
    telegram,
    skype,
    messenger
]

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

export const ChannelList = ({ item, onPress , index }) => {
    const { selectedCallChannel, setSelectedCallChannel } = useContext(ContextChannelForm);
    const { channelName, logo, id } = item
    const isSelected = selectedCallChannel.channelName === channelName;
    const borderColor = isSelected? styles.yellowBorder : styles.whiteBorder;

    const onItemPress = () => {
        onPress()
        setSelectedCallChannel({ id, channelName })
    }

    return (
        <View style={{ marginBottom: 15 }}>
            <TouchableOpacity activeOpacity={1} style={[styles.cardShadow, borderColor ]} onPress={onItemPress}>
                <View style={{ flexDirection: "row", alignItems: "center", height: SIZE.FORM_HEIGHT, paddingHorizontal: 10 }}>
                    <Image source={staticLogo[index]} style={{ resizeMode: "contain", height: 30, width: 30 }} />
                    <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, padding: 8 }} >{channelName}</Text>
                </View>
            </TouchableOpacity>
            { isSelected && (
                <ChannelForm data={item} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    cardShadow: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
    
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1
    },
    yellowBorder: {
        borderWidth: 1,
        borderColor: COLOR.YELLOW
    },
    whiteBorder: {
        borderWidth: 1,
        borderColor: COLOR.WHITE
    },
})