import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CheckBox from 'react-native-check-box';

import {Item, Store} from './';

export const RenderDetails = ({item, allSelected, onPress, onStoreSelect, onItemSelect}) => {

	const [storeitemselected, setstoreitemselected] = useState(allSelected ? true : false)

	useEffect(() => {
		setstoreitemselected(allSelected)
	}, [allSelected])

	return (
		<>
			<Store
				state={storeitemselected}
				data={item}
				onSelect={(raw) => {
					onStoreSelect(raw)
					setstoreitemselected(!storeitemselected)
				}}
				onPress={onPress}
			/>
			{item.cart.map((data, i) => (
				<Item
					key={i}
					state={storeitemselected}
					data={data}
					onSelect={(raw) => {
						onItemSelect(raw)
					}}
				/>
			))}
			<View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	);
}