import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import CheckBox from 'react-native-check-box';
import SwipeableView from 'react-native-swipeable-view';
import Swipeable from 'react-native-swipeable';
import CustomIcon from "../../../../Components/Icons";

import {Item, Store} from './';

export const RenderDetails = ({
	item, 
	storeIndex, 
	allSelected, 
	onPress, 
	onStoreSelect, 
	onItemSelect, 
	onItemLongPress,
	onItemDelete,
	onChangeQuantity
}) => {

	const [storeitemselected, setstoreitemselected] = useState(allSelected ? true : false)
	const [toggleRoot, setToggleRoot] = useState("")
	const [superSelected, setSuperSelected] = useState(allSelected ? true : false)
	const [uncheckedItems, setUncheckedItems] = useState([])
	const [checkedItems, setCheckedItems] = useState([])	
	const [itemsCheckIndex, setItemsCheckIndex] = useState(allSelected ? item.cart.length : 0)

	useEffect(() => {
		setstoreitemselected(allSelected)
		setSuperSelected(allSelected)
	}, [allSelected])

	const DeleteButton = ({onPress}) => {
		return (
		  <>
			<TouchableOpacity
			  onPress={onPress}
			  activeOpacity={1}
			  style={{flex: 1, width: 75, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center'}}>
			  {/* <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text> */}
				<CustomIcon.FoIcon name="trash" size={20} color={"white"} />
			</TouchableOpacity>
		  </>
		);
	};

	const HandleItemSelect = (raw, total) => {

		let currentCheckedItems = JSON.parse(JSON.stringify(checkedItems))
		if(raw.checked){
								
			let exist = currentCheckedItems.findIndex( x => x.id == raw.item.item_id)
			if(exist == -1){
				currentCheckedItems.push({id: raw.item.item_id})
				setCheckedItems(currentCheckedItems)

				if(currentCheckedItems.length == item.cart.length){
					setstoreitemselected(true)
				}else{
					setstoreitemselected(false)
				}
			}else{
				setstoreitemselected(false)
			}
								
		}else{
								
			let index = currentCheckedItems.findIndex( x => x.id == raw.item.item_id)
			currentCheckedItems = currentCheckedItems.splice(index, 1)
			setCheckedItems(currentCheckedItems)

			if(currentCheckedItems.length <= 1){
				setstoreitemselected(false)
			}

			console.log(item.cart.length, currentCheckedItems.length)

		}

		// setstoreitemselected(!storeitemselected)
	}

	return (
		<>
			<Store
				state={storeitemselected}
				data={item || {}}
				storeIndex = {storeIndex}
				onSelect={(raw) => {
					onStoreSelect(raw)
					setstoreitemselected(!storeitemselected)
					setToggleRoot("shop")

					if(!storeitemselected == true){
						//to true
						let items = JSON.parse(JSON.stringify(item.cart))
						let allitems = items.map((data) => {
							return {id: data.item_id}
						})
						setCheckedItems(allitems)
						console.log('firing from here which is to to set status to true', toggleRoot,  storeitemselected)
					}else{
						setToggleRoot("shop")
						setCheckedItems([])
						console.log('firing from here which is to to set status to false', toggleRoot,  storeitemselected)
					}

				}}
				onPress={onPress}
				uncheckedItems = {uncheckedItems}
				setUncheckedItems = {setUncheckedItems}
			/>
				{/* <FlatList
					data={item.cart || []}
					removeClippedSubviews={true}
					renderItem={({item, index}) => {
						return (
							<>
				<SwipeableView
					btnsArray={[
						{
							text: 'Delete',
							component: (
					  		<DeleteButton
									onPress={() => {						
									onItemDelete(item.item_id)
									}}
					  		/>
							)
				  	},
					]}></SwipeableView>
					
							</>
						)
					}}
				/> */}

			{item && item.cart.length > 0 && item.cart.map((data, i) => {

				return (
				<Swipeable 
					rightActionActivationDistance={30}
					rightButtonWidth={75}
					rightButtons={[<DeleteButton onPress={() => {
						onItemDelete(data)
						
					}} />]}
				>
					<Item
						key={i}
						index = {i}
						storeIndex={storeIndex}
						state={toggleRoot == "shop" && storeitemselected || superSelected}
						// state = {storeitemselected}
						data={data}
						onHold={(raw) => {
							setToggleRoot("item")
							onItemLongPress(raw)
							HandleItemSelect(raw, item.cart.length)
						}}
						onSelect={(raw) => {
							setToggleRoot("item")
							onItemSelect(raw)
							HandleItemSelect(raw, item.cart.length)						
						}}
						item={item}
						uncheckedItems={uncheckedItems}
						setstoreitemselected={setstoreitemselected}
						onChangeQuantity={onChangeQuantity}
					/>
				</Swipeable>
				)}
			)}
			
			{/* <View style={{height: 8, backgroundColor: '#F7F7FA'}} /> */}
		</>
	);
}