import React from 'react'
import { View, Text } from 'react-native';
import { FONT } from '../../../../../../res/variables';
import CustomIcon from "../../../../../Components/Icons";

import { RenderDot } from './RenderDot';

export const RenderRow = ({ rows, item, index, active, value }) => {
    const stateColor = active ? "#F6841F" : "#CCCCCC"

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ flexDirection: 'column', marginRight: 25}}>
                {   
                    index !== 0 
                    ? <RenderDot number={3} color={'#ccc'}/>
                    : <RenderDot number={3} color={'#fff'}/>
                }
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomIcon.MCIcon name="circle" size={9} color={stateColor} style={{}} />
                </View>
                <View style={{ alignItems: 'center' }}>
                    {
                        index < rows - 1 
                        ? <RenderDot number={2} color={'#ccc'}/>
                        : <RenderDot number={3} color={'#fff'}/>
                    }
                </View>
            </View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, color: active ? "#F6841F" : "#929191", fontFamily: active ? FONT.BOLD : FONT.REGULAR }}>
                    {item.state}
                </Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: "#929191" }}>{value}</Text>
            </View>
        </View>
    )
}
