import React from 'react'
import { View } from 'react-native';
import CustomIcon from "../../../../../Components/Icons";

export const RenderDot = ({ number, color }) => {
  return (
    <View style={{ alignItems: 'center' }}>
        {[...Array(number)].map((index) =>
            <CustomIcon.FA5Icon 
                key={index} 
                name="stop" 
                size={2} 
                color={color} 
                style={{marginVertical: 1}} 
            />
        )}
    </View>
  )}
