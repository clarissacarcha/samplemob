import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../../Components';
import {throttle} from 'lodash';
import CustomIcon from '../../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';

export const Tab = (props) => {

    const [activeIndex, setActiveIndex] = useState(props.index || 0)

    const onTabPress = throttle(
        (index) => {
            setActiveIndex(index)
            if(props?.onChangeTab){
                props.onChangeTab(index)
            }
        },
        1000,
        {trailing: false},
    );

    return (
        <>
            <View style={styles.container} />
                <View style={styles.subContainer}>
                    <View style={styles.flex1} />
                    <TouchableOpacity onPress={() => onTabPress(0)} style={styles.allButton(activeIndex)}>
                        <Text style={styles.allText(activeIndex)}>All</Text>
                    </TouchableOpacity>
                    <View style={styles.flex1} />
                    <TouchableOpacity onPress={() => onTabPress(1)} style={styles.expiredButton(activeIndex)}>
                        <Text style={styles.expiredText(activeIndex)}>Expired</Text>
                    </TouchableOpacity>
                    <View style={styles.flex1} />
                </View>
            <View style={styles.margin} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 8, 
        backgroundColor: '#F7F7FA'
    },
    subContainer: {
        flex: 0, 
        flexDirection: 'row', 
        paddingVertical: 20
    },
    flex1: {
        flex: 1
    },
    allButton: (activeIndex) => {
        return {
            flex: 3, 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: activeIndex == 0 ? '#FFEBBC' : '#F8F8F8', 
            paddingVertical: 10, 
            borderRadius: 7
        }
    },
    allText: (activeIndex) => {
        return {
            color: activeIndex == 0 ? "#F6841F" : "#929191"
        }
    },
    expiredButton: (activeIndex) => {
        return {
            flex: 3, 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: activeIndex == 1 ? '#FFEBBC' : '#F8F8F8', 
            paddingVertical: 10, 
            borderRadius: 7
        }
    },
    expiredText: (activeIndex) => {
        return {
            color: activeIndex == 1 ? "#F6841F" : "#929191"
        }
    },
    margin: {
        height: 8, 
        backgroundColor: '#F7F7FA'
    }
})