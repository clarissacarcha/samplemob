import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CheckBox from 'react-native-check-box';

import {Item, Store} from './';

export const RenderDetails = ({item, storeIndex, allSelected, onPress, onStoreSelect, onItemSelect, }) => {

	const [storeitemselected, setstoreitemselected] = useState(allSelected ? true : false)
	const [uncheckedItems, setUncheckedItems] = useState([])

	useEffect(() => {
		setstoreitemselected(allSelected)
	}, [allSelected])

	return (
		<>
			<Store
				state={storeitemselected}
				data={item || {}}
				storeIndex = {storeIndex}
				onSelect={(raw) => {
					onStoreSelect(raw)
					setstoreitemselected(!storeitemselected)
				}}
				onPress={onPress}
				uncheckedItems = {uncheckedItems}
				setUncheckedItems = {setUncheckedItems}
			/>
			{item && item.cart.length > 0 && item.cart.map((data, i) => (
				<Item
					key={i}
					index = {i}
					storeIndex = {storeIndex}
					state={storeitemselected}
					data={data}
					onSelect={(raw) => {
						onItemSelect(raw)
						// setstoreitemselected(!storeitemselected)						
					}}
					item = {item}
					uncheckedItems = {uncheckedItems}
					setstoreitemselected = {setstoreitemselected}
				/>
			))}
			<View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	);
}