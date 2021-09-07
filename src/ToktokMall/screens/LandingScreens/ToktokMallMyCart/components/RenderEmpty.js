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
					<Text style={{fontSize: 16, color: "#9E9E9E"}}>Your cart is empty</Text>
				</View>
      </View>
		</>
	)
}