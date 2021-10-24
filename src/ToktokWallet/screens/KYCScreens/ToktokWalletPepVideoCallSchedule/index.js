import React, { useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, Animated, ActivityIndicator } from "react-native";
import { HeaderBack , HeaderTitle} from 'src/revamp';
import CONSTANTS from "common/res/constants";
import {Separator,CheckIdleState} from 'toktokwallet/components';
import { ChannelList, ContextProvider, Submit, ContextChannelForm, modifyPlaceholderAccordingToChannel } from "./components";
import { YellowButton } from 'src/revamp';
import { Transitioning, Transition } from 'react-native-reanimated';

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

const MainComponent = () => {

    const { selectedCallChannel, callChannels } = useContext(ContextChannelForm);
    const transitionRef = useRef();
    const transition = <Transition.Change interpolation="easeOut" />

    const onPress = () => {
        transitionRef.current.animateNextTransition();
    }

    if(callChannels.length === 0){
        return (
            <View style={styles.activityIndicator}>
                <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }
    
    return (
        <Transitioning.View ref={transitionRef} transition={transition} style={styles.container}>
            <FlatList
                data={callChannels}
                renderItem={({ item }) => {
                    return(
                        <ChannelList item={item} onPress={onPress} />
                    )
                }}
                extraData={selectedCallChannel.channelName}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
            { !!selectedCallChannel.channelName && (
               <Submit />
            )}
        </Transitioning.View>
    )
}

export const ToktokWalletPepVideoCallSchedule = ({ navigation }) => {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['PEP Video Call Schedule','']}/>,
    })
   
    return (
        <CheckIdleState>
            <ContextProvider>
                <MainComponent />
            </ContextProvider>
       </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    activityIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})