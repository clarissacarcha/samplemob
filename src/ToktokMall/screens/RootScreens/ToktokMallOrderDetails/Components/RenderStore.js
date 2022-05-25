import React, { useState } from 'react'
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import { COLOR } from '../../../../../res/variables';
import {storeIcon} from '../../../../assets';
import {RenderItem} from './RenderItem'

export const RenderStore = ({data , navigation}) => {
    const [bolean,setBolean] = useState(true);
    
    return (
        <>
            <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 16}}>
                <View style={{flex: 0}}>
                    <Image source={storeIcon} style={{width: 24, height: 24, resizeMode: 'stretch'}} />
                </View>
                <View style={{flex: 1, paddingHorizontal: 7.5, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14}}>{data?.orders?.shopName}</Text>
                </View>
                {/* <View style={{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>setBolean(!bolean)}>
                        <AIcons  name = {bolean ? 'up' : 'down'} size = {17} color = {COLOR.ORANGE}/>
                    </TouchableOpacity>
                </View> */}
                <View style={{flex: 0, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14}}>
                        {data?.orders?.totalItems}{' '}
                        {data?.orders?.totalItems > 1 ? "items" : "item"}
                    </Text>
                </View>
            </View>
            {bolean &&
                <FlatList 
                    data={data?.orders?.items}
                    renderItem={({item, index}) => (
                        <RenderItem 
                            key={index}
                            data={item}
                            navigation={navigation}
                        />
                    )}
                 />
            }
        </>
    )
}
