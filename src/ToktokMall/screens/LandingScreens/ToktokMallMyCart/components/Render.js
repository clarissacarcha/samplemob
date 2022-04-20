import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useRef, useContext, createRef, forwardRef} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, BackHandler} from 'react-native';
import Swipeable from 'react-native-swipeable';
import CustomIcon from "../../../../Components/Icons";
import { ArrayCopy } from '../../../../helpers';
import {useFocusEffect} from '@react-navigation/native'

import { CartContext } from '../ContextProvider';

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

export const RenderDetails = forwardRef(({
	references,
	item,  
	onPress, 
	onStoreSelect, 
	onItemSelect, 
	onItemLongPress,
	onItemDelete,
	onChangeQuantity,
	refreshing,
	willDelete
}, ref) => {

	const navigation = useNavigation()
	const CartContextData = useContext(CartContext)

	const [storeItemSelected, setStoreItemSelected] = useState(CartContextData.selectAll ? true : false)
	const [storeItemUnselected, setStoreitemUnselected] = useState(!CartContextData.selectAll ? true : false)
	const [selectedItemsCount, setSelectedItemsCount] = useState(0)
	const [heldItem, setHeldItem] = useState({})
	const [storecheckboxState, setstorecheckboxstate] = useState(false)

	useEffect(() => {
		if(CartContextData.selectAll){
			toggleCheckBox(true)
		}else{
			if(CartContextData.selectedFrom == 'all'){ // prevent setting items to false unless clicked from selected all
				toggleCheckBox(false)
			}
		}
	}, [CartContextData.selectAll])
	// },[])

	useEffect(() => {
		setSelectedItemsCount(0)
	}, [refreshing])

	useEffect(() => {
		// console.log("Selected Count: ", selectedItemsCount)
	}, [selectedItemsCount])

	useEffect(() => {

    const unsubscribe = navigation.addListener('blur', () => {
      ref.current.map((item, index) => {
				if(item.current != null){
					item?.recenter()
				}
      })
    });

    return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		console.log('item swiped state',CartContextData.itemSwiped)
	}, [CartContextData.itemSwiped])
	
	useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
					ref.current.map((item, index) => {
						if(item.recenter){
							item?.recenter()
							return true
						}
					})
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )


	const getCheckboxState = () => {
		if(storeItemSelected && !storeItemUnselected) return true
		else if(!storeItemSelected && storeItemUnselected) return false
	}

	const getStoreCheckboxState = () => {

		if(CartContext.willDelete){
			if(item.data.length > 0){
				for(var i in item.data){
					if(item.data[i].product.enabled != 1){
						return false
					}
				}
			}
		}

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
		console.log('set to state toggle checkbox store', val)
		if(val){ // from which state
			setStoreItemSelected(true)
			setStoreitemUnselected(false)
			setSelectedItemsCount(CartContext.willDelete ? 
				item.data : 
				item.data.filter(item => (item.product.enabled === 1 && item.product.noOfStocks !== 0 || item.product.enabled === 1 && item.product.contSellingIsset === 1)).length)
			return true
		}else if(!val){
			setStoreItemSelected(false)
			setStoreitemUnselected(true)
			setSelectedItemsCount(0)
			return false
		}
	}

	const storeCheckboxIsDisabled = () => {
		if(CartContextData.willDelete){
			return false
		}
		if(item.data.length > 0){
			for(var i in item.data){

				if(item.data[i].product.enabled != 1 || item.data[i].product.contSellingIsset === 0 && item.data[i].product.noOfStocks === 0){
					return true
				}
			}
			return false
	}
}
	return (
    <>
      <Store
        state={getStoreCheckboxState()}
        data={item?.shop || {}}
				disabled={storeCheckboxIsDisabled()}
        onSelect={(raw) => {
          toggleCheckBox(raw.checked);
          onStoreSelect(raw, CartContext.willDelete ? 
						item.data : 
						item.data.filter(item => (item.product.enabled === 1 && item.product.noOfStocks !== 0)));
					CartContextData.setSelectAll(false);
					CartContextData.setSelectedFrom('store')
        }}
        onPress={onPress}
      />

      {
				item &&
        item.data.length > 0 &&
        item.data.map((data, i) => {

					//TRACK THE REFERENCE BY PRODUCT ID
					let trackingIndex = references.findIndex((e) => e.id == data.product.Id)
					
					const Wrapper = willDelete ? View : Swipeable
					const props = willDelete
											? {}
											: {
												//ASSIGN THIS SWIPEABLE TO REFERENCES INDEXED BY THE TRACKED INDEX
												onRef: (_ref) => {ref.current[trackingIndex] = _ref}, 
												onSwipeComplete: () => {
													
													//LOOP THROUGH REFERENCES AND HIDE ALL ACTIVE SWIPEABLE VIEWS
													if(ref.current.length > 0){
														ref.current.map((item, index) => {
															//IF TRACKED REFERENCE IS THE CURRENT SWIPEABLE, SKIP 
															if(trackingIndex == index){
																return
															}else{
																//HIDE ACTIVE SWIPEABLE VIEWS NOW
																if(item.recenter){
																item.recenter()
																}
															}
														})
													}

												},
												swiperReference: data.product.Id,
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
								heldItem = {heldItem}
								forceSelect={selectedItemsCount == item.data.length}
								forceSelectToZero = {selectedItemsCount == 0  }
								data={data}
								recenter = {() => {
									if(ref.current.length > 0){
										ref.current.map((item, index) => {
											//IF TRACKED REFERENCE IS THE CURRENT SWIPEABLE, SKIP 
											if(trackingIndex == index){
												return
											}else{
												//HIDE ACTIVE SWIPEABLE VIEWS NOW
												if(item.recenter){
												item.recenter()
												}
											}
										})
									}
								}}
                onHold={(raw) => {

									if(ref.current && ref.current.length > 0){
										ref.current.map((item, index) => {
											// console.log(item)
											if(item.current != null){
												item?.recenter()
											}
										})
									}									

									setHeldItem(raw)
									if (raw.checked) {
                    setSelectedItemsCount(selectedItemsCount + 1);
                  } else if (!raw.checked) {
                    setSelectedItemsCount(selectedItemsCount - 1);
                  }
									console.log(raw)
									onItemLongPress(raw);
									// swipableRef.recenter()
                }}
                onSelect={(raw) => {		
									if(ref.current && ref.current.length > 0){
										ref.current.map((item, index) => {
											// console.log(item)
											if(item.current != null){
												item?.recenter()
											}
										})
									}									

                  if (raw.checked) {
                    setSelectedItemsCount(selectedItemsCount + 1);
                  } else if (!raw.checked) {
										CartContextData.setSelectAll(false);
                    setSelectedItemsCount(selectedItemsCount - 1);
                  }
                  onItemSelect(raw);

                }}
                item={item}
								onChangeQuantity={onChangeQuantity}
								willDelete = {willDelete}
								setHeldItem = {setHeldItem}
              />
           </Wrapper>
          );
        })}

      {/* <View style={{height: 8, backgroundColor: '#F7F7FA'}} /> */}
    </>
  );
})