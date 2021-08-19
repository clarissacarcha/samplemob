import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CheckBox from 'react-native-check-box';
import SwipeableView from 'react-native-swipeable-view';

import {Item, Store} from './';

export const RenderDetails = ({item, storeIndex, allSelected, onPress, onStoreSelect, onItemSelect, }) => {

	const [storeitemselected, setstoreitemselected] = useState(allSelected ? true : false)
	const [uncheckedItems, setUncheckedItems] = useState([])
	const [checkedItems, setCheckedItems] = useState([])	
	const [itemsCheckIndex, setItemsCheckIndex] = useState(allSelected ? item.cart.length : 0)

	useEffect(() => {
		setstoreitemselected(allSelected)
	}, [allSelected])

	const DeleteButton = ({onPress}) => {
		return (
		  <>
			<TouchableOpacity
			  onPress={onPress}
			  activeOpacity={1}
			  style={{flex: 1, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center'}}>
			  <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text>
			</TouchableOpacity>
		  </>
		);
	};

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
				<SwipeableView
				btnsArray={[
				  {
					text: 'Delete',
					component: (
					  <DeleteButton
						onPress={() => {
						//   updateMyFavorites("delete", {shop: item.shop, item: raw})
						//   setMessageModalShown(true);
							console.log('delete')
						}}
					  />
					),
				  },
				]}>
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
				</SwipeableView>
			))}
			{/* <View style={{height: 8, backgroundColor: '#F7F7FA'}} /> */}
		</>
	);
}