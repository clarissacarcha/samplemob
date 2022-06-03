import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';
import { Price } from '../../../../helpers';

export const CheckoutFooter = ({subtotal, onSubmit}) => {
    return (
        <>
            <View 
                style={{flex: 1, backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%'}}
            >
                <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Subtotal </Text>
                        <Text style={{fontSize: 18, color: "#F6841F"}}><Price amount={subtotal} /></Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <TouchableOpacity onPress={onSubmit} style={{backgroundColor: '#F6841F', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 5}}>
                            <Text style={{fontSize: 14, color: '#fff'}}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}