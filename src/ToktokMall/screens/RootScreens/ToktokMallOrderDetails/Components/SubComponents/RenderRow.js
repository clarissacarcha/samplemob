import React from 'react'
import { View, Text } from 'react-native';
import { FONT } from '../../../../../../res/variables';
import CustomIcon from "../../../../../Components/Icons";

import { RenderDot } from './RenderDot';

export const RenderRow = ({ rows, item, index }) => {
    const statuses = [
        "Order delivered",
        "Order is ready to be delivered",
        "Booking order is confirmed",
        "Order is ready to be picked up",
        "Preparing Order", 
        "Order Confirmed",
    ]
    const stateColor = item.date ? "#F6841F" : "#CCCCCC"

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ flexDirection: 'column', marginRight: 20}}>
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
                <Text style={{ 
                    fontSize: 12, color: item.date ? "#F6841F" : "#929191", 
                    fontFamily: item.date ? FONT.BOLD : FONT.REGULAR 
                }}>
                    {statuses[index]}
                </Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: "#929191" }}>{item.date}</Text>
            </View>
        </View>
    )
}
