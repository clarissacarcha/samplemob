import React, { useState } from 'react'
import { StyleSheet,View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import { COLOR } from '../../../../../res/variables';
import { storeIcon } from '../../../../assets';
import { RenderItem } from './RenderItem'

export const RenderStore = ({data , navigation}) => {
    const [bolean,setBolean] = useState(true);

    const renderTotalItems = () => {
        const total = data?.orders?.items.reduce((prevTotal, newTotal) => prevTotal + newTotal.quantity, 0);
        return total <= 1 ? `${total} item` : `${total} items`;
    }
    
    return (
        <>
            <View style={styles.container}>
                <View style={{flex: 0}}>
                    <Image source={storeIcon} style={styles.images} />
                </View>
                <View style={styles.shopContainer}>
                    <Text style={{fontSize: 14}}>
                        {data?.orders?.shopName}
                    </Text>
                </View>
                {/* <View style={{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>setBolean(!bolean)}>
                        <AIcons  
                            name = {bolean ? 'up' : 'down'} 
                            size = {17} 
                            color = {COLOR.ORANGE}
                        />
                    </TouchableOpacity>
                </View> */}
                <View style={{flex: 0, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14}}>
                        {renderTotalItems()}
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        paddingHorizontal: 15, 
        paddingVertical: 16
    },
    images: {
        width: 24, 
        height: 24, 
        resizeMode: 'stretch'
    },
    shopContainer: {
        flex: 1, 
        paddingHorizontal: 7.5, 
        justifyContent: 'center'
    }
  }) 