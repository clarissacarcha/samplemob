import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'

export const ViewAccountRecovery = ({
    data
})=> {

    const navigation = useNavigation();

    const onPress = ()=> {
        navigation.pop();
    }

    return (
        <>
        <View style={styles.container}>
        <   View style={styles.body}>
                <Text>{JSON.stringify(data)}</Text>
            </View>
            <View style={styles.btn}>
                <YellowButton label="Back" onPress={onPress}/>
            </View>
            <BuildingBottom/>
        </View> 
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    body: {
        flex: 1,
    },
    btn: {
        height: 70,
        justifyContent: "flex-end"
    },
})