import React from 'react'
import {Image,Dimensions} from 'react-native'

const {width,height} = Dimensions.get("window")


export const BuildingBottom = ()=> {
    return <Image resizeMode="cover" style={{position:'absolute',bottom: 0 , left: 0, width:width,zIndex: -1,alignSelf:"flex-end"}} source={require("toktokwallet/assets/images/building.png")}/>
}