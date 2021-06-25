import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import {  LandingSubHeader, Product } from '../../../../Components'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';

export const ToktokMallCategoriesList = ({navigation})=> {

    return (
        <>
        <View style={styles.container}>            
            <LandingSubHeader /> 
            <View>
                <Product />
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