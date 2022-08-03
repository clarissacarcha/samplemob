import React from 'react'
import { View,StyleSheet } from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../Components'
import { COLOR } from '../../../../res/variables';

export const ToktokMallNotificationsx = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Notifications', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1}}>    
                
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
