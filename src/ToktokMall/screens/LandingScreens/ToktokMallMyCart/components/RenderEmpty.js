import React from "react";
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CustomIcon from '../../../../Components/Icons';
import {emptyCartIcon} from '../../../../assets';

export const RenderEmpty = () => {
	return (
		<>
			<View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
        {/* <CustomIcon.MCIcon name="cart-remove" size={80} color="#F6841F" /> */}
				<Image 
					source={emptyCartIcon}
					style={{width: 220, height: 130, resizeMode: 'cover'}}
				/>
        <View style={{height: 8}} />
        <View>
					<Text style={{fontSize: 16, color: "#9E9E9E"}}>Your cart is empty</Text>
				</View>
      </View>
		</>
	)
}