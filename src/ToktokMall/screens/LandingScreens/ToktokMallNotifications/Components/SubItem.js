import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';

export const SubItem = ({index, total, data, root}) => {
    let bgcol = "rgba(204, 204, 204, 0.2)"
    return (
        <>
            <View style={{flexDirection: 'row', backgroundColor: bgcol}}>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15}}>
                        <View style={{flex: 1, backgroundColor: index == 0 ? 'transparent' : "#C4C4C4", width: '3%'}}></View>
                        <CustomIcon.MCIcon name="circle" size={9} color="#C4C4C4" style={{position: 'absolute'}} />
                        <View style={{flex: 1, backgroundColor: total - 1 == index ? "transparent" : "#C4C4C4", width: '3%'}}></View>
                    </View>
                    <View style={{flex: 12, paddingHorizontal: 0, paddingVertical: 15}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 4}}>
                                <Text style={{fontSize: 14, color: "#707171"}}>{data.title}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row-reverse', paddingHorizontal: 15}}>
                                <Text style={{color: "#9E9E9E", fontSize: 10}}>{data.date}</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{paddingRight: 15}}>
                            <Text style={{fontSize: 12, color: "#9E9E9E"}}>{data.description.split("&id")[0]} <Text style={{color: "#F6841F", fontSize: 12}}>{root.id}</Text> {data.description.split("&id")[1]}</Text>    
                            </View>                            
                        </View>
                        <View style={{paddingTop: 15}}>
                            <View style={{ height: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)'}} />
                        </View>                            
                    </View>
                </View>
        </>
    )
}
