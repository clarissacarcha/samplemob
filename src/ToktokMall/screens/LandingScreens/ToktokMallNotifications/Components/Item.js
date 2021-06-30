import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';

export const Item = ({active, data, onSelect}) => {
    return (
        <>
            <View style={{flexDirection: 'row', backgroundColor: active ? '#fff' : '#FFFCF4'}}>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 15}}>
                        <Image 
                            source={require("../../../../assets/images/coppermask.png")} 
                            style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}}
                        />
                    </View>
                    <View style={{flex: 8, paddingVertical: 20, paddingHorizontal: 0}}>
                        <Text style={{fontSize: 14}}>{data.title}</Text>
                        <Text style={{fontSize: 12, color: "#9E9E9E"}}>{data.description.split("&id")[0]}<Text style={{color: "#F6841F", fontSize: 12}}>{data.id}</Text> {data.description.split("&id")[1]}</Text>
                    </View>
                    <View style={{flex: 2, paddingVertical: 20, paddingHorizontal: 15}}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color: "#9E9E9E", fontSize: 10}}>{data.date}</Text>
                        </View>
                        <TouchableOpacity onPress={onSelect} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <CustomIcon.FeIcon name="chevron-down" size={25} color="#9E9E9E" />
                        </TouchableOpacity>                        
                    </View>
                </View>
                <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}