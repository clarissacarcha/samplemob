import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { HeaderBack, HeaderTitle, HeaderRight, Header } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';

import { Dropdown } from '../../../../Components';


export const ToktokMallCategoriesSearch = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack hidden={true} />,
        headerTitle: () => <HeaderTitle label={['Categories', '']} />,
        headerRight: () => <HeaderRight icon="search" iconSize={18} onPress={() => navigation.navigate("ToktokMallMessageConvo")} />
    });

    return (
        <>
        <View style={styles.container}>
            <Header 
                label="Categories" 
                renderRight={() => <HeaderRight icon="search" iconSize={18} onPress={() => navigation.navigate("ToktokMallMessageConvo")} />} 
            />
            <View style={{flex: 1}}>   
             
                <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
                
                <Dropdown />

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
