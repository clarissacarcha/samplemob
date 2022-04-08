import React from 'react'
import {View, Text, Image,TouchableOpacity} from 'react-native';
import { FONT } from '../../../../../res/variables';
import {carIcon, walletIcon} from './../../../../assets';

export const RenderOrderInfo = ({data}) => {
    return (
        <>
            <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />

            <View style={{flexDirection: 'row', justifyContent:'space-between', paddingVertical: 16, paddingHorizontal: 15, backgroundColor: '#FFFCF4'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Order ID </Text>
                    <Text style={{color: "#F6841F", fontSize: 13, paddingLeft: 10}}>{data?.referenceNum}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:'center',}}>
                    <Image 
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                    source={carIcon}
                    />
                <Text style={{color: "#F6841F", fontSize: 13, fontFamily: FONT.BOLD, paddingLeft: 10}} >Confirmed</Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', justifyContent:'space-between',paddingVertical: 16, paddingHorizontal: 15}}>
            <View style={{flex: 1.5, flexDirection: 'column'}}>
                <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Delivery Information</Text>
                <Text style={{color: "#9E9E9E", fontSize: 11}}>{data?.formattedDateOrdered}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center',}}>
                <Image 
                    style={{ height: 20, width: 100, resizeMode: 'contain' }}
                    source={walletIcon}
                />
            </View>
            </View>

            <View style={{ height: 2, backgroundColor: '#F7F7FA', marginHorizontal:16}} />
        </>
    )
}
