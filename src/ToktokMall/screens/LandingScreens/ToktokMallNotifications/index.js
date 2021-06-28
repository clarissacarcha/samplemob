import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../Components'
import { AlertOverlay} from '../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';

export const ToktokMallNotifications = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack hidden={true} />,
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
