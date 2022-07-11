import React , {useContext} from "react";
import {View,StyleSheet,Text} from "react-native"
import { PepQuestionnaire as PepQuestionnaireComponent } from "toktokwallet/components";
import {VerifyContext} from '../VerifyContextProvider';

export const PepQuestionnaire = ()=> {

    const {
        pepInfo,
        setPepInfo,
        setCurrentIndex,
    } = useContext(VerifyContext);

    const callBackFunction = () => {
        setCurrentIndex(oldval => oldval + 1);
    }

    return (
        <View style={styles.container}>
            <PepQuestionnaireComponent
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