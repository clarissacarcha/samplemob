import React, { useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, Animated } from "react-native";
import { HeaderBack , HeaderTitle} from 'src/revamp';
import CONSTANTS from "common/res/constants";
import {Separator} from 'toktokwallet/components';
import { SELECTION_LIST } from "./constants";
import { ChannelList, ContextProvider, Submit, ContextChannelForm, modifyPlaceholderAccordingToChannel } from "./components";
import { YellowButton } from 'src/revamp';
import { Transitioning, Transition } from 'react-native-reanimated';

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;

const MainComponent = () => {

    const { selectedChannel } = useContext(ContextChannelForm);
    const transitionRef = useRef();
    const transition = <Transition.Change interpolation="easeOut" />

    const onPress = () => {
        transitionRef.current.animateNextTransition();
    }
    

    return (
        <Transitioning.View ref={transitionRef} transition={transition} style={styles.container}>
            <FlatList
                data={SELECTION_LIST}
                renderItem={({ item }) => {
                    return(
                        <ChannelList item={item} onPress={onPress} />
                    )
                }}
                extraData={selectedChannel}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
            { !!selectedChannel && (
               <Submit />
            )}
        </Transitioning.View>
    )
}

export const ToktokWalletVideoCallSchedule = ({ navigation }) => {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Video Call Schedule','']}/>,
    })
   
    return (
       <ContextProvider>
           <MainComponent />
       </ContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})