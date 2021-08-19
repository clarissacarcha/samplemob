import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CheckBox from 'react-native-check-box';
import SwipeableView from 'react-native-swipeable-view';
import CustomIcon from "../../../../Components/Icons";

import {Item, Store} from './';

export const RenderDetails = ({
	item, 
	storeIndex, 
	allSelected, 
	onPress, 
	onStoreSelect, 
	onItemSelect, 
	onItemDelete,
	onChangeQuantity
}) => {

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
			  {/* <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text> */}
				<CustomIcon.FoIcon name="trash" size={20} color={"white"} />
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
								onItemDelete(data.item_id)
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

							let currentCheckedItems = JSON.parse(JSON.stringify(checkedItems))
							if(raw.checked){
								
								let exist = currentCheckedItems.findIndex( x => x.index == i)
								if(exist == -1){
									currentCheckedItems.push({index: i})
									setCheckedItems(currentCheckedItems)

									if(currentCheckedItems.length == item.cart.length){
										setstoreitemselected(true)
									}else{
										setstoreitemselected(false)
									}
								}
								
							}else{
								
								let index = currentCheckedItems.findIndex( x => x.index == i)
								currentCheckedItems.splice(index, 1)
								setCheckedItems(currentCheckedItems)
								if(currentCheckedItems.length <= 1){
									setstoreitemselected(false)
								}

							}
							// setstoreitemselected(!storeitemselected)						
						}}
						item = {item}
						uncheckedItems = {uncheckedItems}
						setstoreitemselected = {setstoreitemselected}
						onChangeQuantity={onChangeQuantity}
					/>
				</SwipeableView>
			))}
			{/* <View style={{height: 8, backgroundColor: '#F7F7FA'}} /> */}
		</>
	);
}