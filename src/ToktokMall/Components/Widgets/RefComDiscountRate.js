import React from 'react'
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';

export const RefComDiscountRate = ({value, w = '50%'}) => {
	return (
		<>
			<View style={{flex: 0, width: w}}>
        <Text style={{fontSize: 9, fontWeight: "700", color: "#fff", backgroundColor: '#FF0F00', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3, textAlign: 'center'}}>{value}</Text>
      </View>
		</>
	)
}