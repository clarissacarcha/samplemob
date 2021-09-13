import React from 'react'
import { View , Text , StyleSheet } from 'react-native'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { Separator } from 'toktokwallet/components'

export const ToktokWalletNotifications = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Notifications']} />,
    })

    return (
        <>
            <Separator/>
            <View style={styles.container}>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    }
})