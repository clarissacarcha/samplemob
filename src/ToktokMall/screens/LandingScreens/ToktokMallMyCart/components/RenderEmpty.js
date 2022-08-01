import React from "react";
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CustomIcon from '../../../../Components/Icons';
import {emptyCartIcon} from '../../../../assets';

export const RenderEmpty = () => {
	return (
		<>
			<View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
        <Image 
					source={emptyCartIcon}
					style={{width: '80%', height: Dimensions.get("screen").height / 4, resizeMode: 'contain'}}
				/>
        <View style={{height: 8}} />
        <View>
					<Text style={{fontSize: 16, color: "black", textAlign: 'center'}}>Your cart is empty</Text>
					<Text style={{fontSize: 12, color: '#525252', textAlign: 'center'}}>Browse our products and add to your cart now!</Text>
				</View>
      </View>
		</>
	)
}