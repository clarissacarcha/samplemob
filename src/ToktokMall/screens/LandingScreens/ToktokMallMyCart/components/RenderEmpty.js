import React from "react";
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CustomIcon from '../../../../Components/Icons';
import {emptyCartIcon} from '../../../../assets';

export const RenderEmpty = () => {
	return (
		<>
			<View style={styles.container}>
				<Image 
					source={emptyCartIcon}
					style={styles.emptyIcon}
				/>
				<View style={styles.margin} />
				<View>
					<Text style={styles.emptyTitle1}>Your cart is empty</Text>
					<Text style={styles.emptyTitle2}>Browse our products and add to your cart now!</Text>
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: 'white', 
		alignItems: 'center', 
		justifyContent: 'center'
	},
	emptyIcon: {
		width: '80%', 
		height: Dimensions.get("screen").height / 4, 
		resizeMode: 'contain'
	},
	margin: {
		height: 8
	},
	emptyTitle1: {
		fontSize: 16, 
		color: "black", 
		textAlign: 'center'
	},
	emptyTitle2: {
		fontSize: 12, 
		color: '#525252', 
		textAlign: 'center'
	}
})