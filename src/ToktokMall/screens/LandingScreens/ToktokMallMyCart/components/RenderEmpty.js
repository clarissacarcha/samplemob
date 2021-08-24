import React from "react";
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CustomIcon from '../../../../Components/Icons';

export const RenderEmpty = () => {
	return (
		<>
			<View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
        <CustomIcon.MCIcon name="cart-remove" size={80} color="#F6841F" />
        <View style={{height: 30}} />
        <View>
					<Text style={{fontSize: 13, color: "rgba(158, 158, 158, 1)"}}>Your cart is empty</Text>
				</View>
      </View>
		</>
	)
}