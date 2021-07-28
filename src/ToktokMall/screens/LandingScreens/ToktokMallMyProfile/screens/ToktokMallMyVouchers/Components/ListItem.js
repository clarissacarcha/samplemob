import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../../Components';
import CustomIcon from '../../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';

export const ListItem = (props) => {

    let state = props?.status == "active" ? true : false || false
    let expiry = state ? "Valid Until: 5-24-2021" : "Expired"

    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                <View style={{flex: 0, width: 60, height: 60, backgroundColor: state ? '#FCC442' : "#DADADA", alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 12, padding: 4, fontFamily: FONT.BOLD, color: "#fff"}}>FREE SHIPPING</Text>
                </View>
                <View style={{flex: 9, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10}}>
                    <Text style={{fontSize: 14, fontFamily: FONT.REGULAR, color: state ? "#222222" : "#9E9E9E"}}>Free Shipping Voucher</Text>
                    <Text style={{color: "#9E9E9E", fontSize: 11}}>{expiry}</Text>
                </View>
                <TouchableOpacity style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                    {state && <Text style={{fontSize: 9, color: "#F6841F"}}>Expiring: 24 hours left</Text>}
                </TouchableOpacity>
            </View>
            <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}