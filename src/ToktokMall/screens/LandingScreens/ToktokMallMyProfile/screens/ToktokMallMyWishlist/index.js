import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';

export const ToktokMallMyWishlist = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Favorites', '']} />,
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
