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
            <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
                <View style={{flex: 0, flexDirection: 'row', paddingVertical: 20}}>
                    <View style={{flex: 1}} />
                    <TouchableOpacity onPress={() => onTabPress(0)} style={{flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: activeIndex == 0 ? '#FFEBBC' : '#F8F8F8', paddingVertical: 10, borderRadius: 7}}>
                        <Text style={{color: activeIndex == 0 ? "#F6841F" : "#929191"}}>All</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}} />
                    <TouchableOpacity onPress={() => onTabPress(1)} style={{flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: activeIndex == 1 ? '#FFEBBC' : '#F8F8F8', paddingVertical: 10, borderRadius: 7}}>
                        <Text style={{color: activeIndex == 1 ? "#F6841F" : "#929191"}}>Expired</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}} />
                </View>
            <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
        </>
    )
}