import React, {useContext} from "react";
import {View,StyleSheet,Text} from "react-native"
import { PepRequestVideoCall as PepRequestVideoCallComponent } from "toktokwallet/components";
import {ContextEnterpriseApplication} from "../ContextProvider";

export const PepRequestVideoCall = ()=> {

    const {
        pepInfo,
        setPepInfo,
        setCurrentIndex,
    } = useContext(ContextEnterpriseApplication);

    const callBackFunction = () => {
        setCurrentIndex(oldval => oldval + 1);
    }

    return (
        <View style={styles.container}>
           <PepRequestVideoCallComponent
              pepInfo={pepInfo}
              setPepInfo={setPepInfo}
              callback={callBackFunction}
           />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})