import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import Swipeable from 'react-native-swipeable';
import CustomIcon from "../../../../Components/Icons";

import {Item, Store} from './';

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

export const RenderDetails = ({
	item,  
	allSelected, 
	onPress, 
	onStoreSelect, 
	onItemSelect, 
	onItemLongPress,
	onItemDelete,
	onChangeQuantity,
	refreshing,
	willDelete
}) => {

	const [storeItemSelected, setStoreItemSelected] = useState(allSelected ? true : false)
	const [storeItemUnselected, setStoreitemUnselected] = useState(!allSelected ? true : false)
	const [selectedItemsCount, setSelectedItemsCount] = useState(0)

	useEffect(() => {
		toggleCheckBox(allSelected)
	}, [allSelected])

	useEffect(() => {
		setSelectedItemsCount(0)
	}, [refreshing])

	useEffect(() => {
		// console.log("Selected Count: ", selectedItemsCount)
	}, [selectedItemsCount])

	const getCheckboxState = () => {
		if(storeItemSelected && !storeItemUnselected) return true
		else if(!storeItemSelected && storeItemUnselected) return false
	}

	const getStoreCheckboxState = () => {

		let isStoreSelected = getCheckboxState()
		let isAllSelected = selectedItemsCount == item.data.length		
		if(isAllSelected){
			return true
		}
		else if(isStoreSelected){
			if(!isAllSelected){
				return false
			}else{
				return true
			}
		}
		else if(isStoreSelected && !isAllSelected){
			return false
		}
		else return false
	}

	const toggleCheckBox = (val) => {
		if(val){
			setStoreItemSelected(true)
			setStoreitemUnselected(false)
			setSelectedItemsCount(item.data.length)
			return true
		}else if(!val){
			setStoreItemSelected(false)
			setStoreitemUnselected(true)
			setSelectedItemsCount(0)
			return false
		}
	}




	return (
    <>
      <Store
        state={getStoreCheckboxState()}
        data={item?.shop || {}}
        onSelect={(raw) => {
          toggleCheckBox(raw.checked);
          onStoreSelect(raw, item.data);
        }}
        onPress={onPress}
      />

      {item &&
        item.data.length > 0 &&
        item.data.map((data, i) => {
			const Wrapper = willDelete ? View : Swipeable
			const props = willDelete
			? {}
			: {
				rightActionActivationDistance: 30,
				rightButtonWidth: 75,
				rightButtons: [
				  <DeleteButton
					onPress={() => {
					  onItemDelete({
						shop: item.shop,
						product: data.product,
					  });
					}}
				  />,
				],
			  };
          return (
            <Wrapper {...props}>
              <Item
                key={i}
                index={i}
                state={getCheckboxState()}
                forceSelect={selectedItemsCount == item.data.length}
                data={data}
                onHold={(raw) => {
                  onItemLongPress(raw);
                }}
                onSelect={(raw) => {
                  if (raw.checked) {
                    setSelectedItemsCount(selectedItemsCount + 1);
                  } else if (!raw.checked) {
                    setSelectedItemsCount(selectedItemsCount - 1);
                  }
                  onItemSelect(raw);
                }}
                item={item}
                onChangeQuantity={onChangeQuantity}
              />
            </Wrapper>
          );
        })}

      {/* <View style={{height: 8, backgroundColor: '#F7F7FA'}} /> */}
    </>
  );
}