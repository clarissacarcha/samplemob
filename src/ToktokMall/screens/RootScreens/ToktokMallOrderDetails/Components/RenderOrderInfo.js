import React from 'react'
import {View, Text, Image,TouchableOpacity} from 'react-native';
import { FONT } from '../../../../../res/variables';
import {carIcon, cancelledIcon, deliveredIcon, walletIcon} from './../../../../assets';

export const RenderOrderInfo = ({data}) => {
  
    const status = ['All', 'Confirmed', 'To Ship', 'To Receive', 'Delivered', 'Cancelled']

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
                    source={
                          data?.status?.status === 5 ? cancelledIcon
                        : data?.status?.status === 4 ? deliveredIcon
                        : carIcon
                    }
                    />
                <Text style={{color: "#F6841F", fontSize: 13, fontFamily: FONT.BOLD, paddingLeft: 10}} >{status[data?.status?.status]}</Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', justifyContent:'space-between',paddingVertical: 16, paddingHorizontal: 15}}>
            <View style={{flex: 1.5, flexDirection: 'column'}}>
                <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Delivery Information</Text>
                <Text style={{color: "#9E9E9E", fontSize: 11}}>{data?.status?.date}</Text>
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
