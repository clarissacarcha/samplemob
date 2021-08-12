import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux'
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';

import {MessageModal} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails} from './components';
import {ASGetCart, ASClearCart} from '../../../helpers';

const testdata = [
  {
    store_id: 1,
    store: 'Face Mask PH',
    cart: [
      {
        item_id: 1,
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 100,
        variation: 'Bronze',
        qty: 1,
        store_id: 1,
        store: 'Face Mask PH',
      },
      {
        item_id: 2,
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 150,
        variation: 'White',
        qty: 1, 
        store_id: 1,
        store: 'Face Mask PH',
      },
    ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {
    store_id: 2,
    store: 'The Apparel',
    cart: [
      {
        item_id: 1,
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 50,
        variation: 'White, L',
        qty: 2,
        store_id: 2,
        store: 'The Apparel',
      },
    ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {
    store_id: 3,
    store: 'The Apparel 2',
    cart: [
      {
        item_id: 1,
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 350,
        variation: 'White, L',
        qty: 2,
        store_id: 3,
        store: 'The Apparel 2',
      },
    ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
];

let testData2 =  [
  {
    store_id: 1,
    store: 'Face Mask PH',
    cart: [
      {
        item_id: 1,
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 100,
        variation: 'Bronze',
        qty: 1,
        store_id: 1,
        store: 'Face Mask PH',
      },
      {
        item_id: 2,
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 150,
        variation: 'White',
        qty: 1, 
        store_id: 1,
        store: 'Face Mask PH',
      },
    ],
    delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {
    store_id: 2,
    store: 'The Apparel',
    cart: [
      {
        item_id: 1,
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 50,
        variation: 'White, L',
        qty: 2,
        store_id: 2,
        store: 'The Apparel',
      },
    ],
    delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {
    store_id: 3,
    store: 'The Apparel 2',
    cart: [
      {
        item_id: 1,
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 350,
        variation: 'White, L',
        qty: 2,
        store_id: 3,
        store: 'The Apparel 2',
      },
    ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
];

const Component =  ({
  navigation,
  myCart,
  createMyCartSession,
}) => {
  const [allSelected, setAllSelected] = useState(true);
  const [willDelete, setWillDelete] = useState(false);
  const [messageModalShown, setMessageModalShown] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [itemsToDelete, setItemsToDelete] = useState(0)
  const [selectedItemsArr, setSelectedItemsArr] = useState(testData2)
  const [unSelectedItemsArr, setUnSelectedItemsArr] = useState([])
  const [ifExisting, setIfExisting] = useState(false)
  // let itemIdArr = []
  let checkedItemsArr = []

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const getSubTotal = async () => {
    let a = 0;
    // for (var x = 0; x < testdata.length; x++) {
    //   for (var y = 0; y < testdata[x].cart.length; y++) {
    //     let item = testdata[x].cart[y];
    //     a += item.price * item.qty;
    //     console.log(a);
    //   }
    // }
    for (var x = 0; x < myCart.length; x++) {
      for (var y = 0; y < myCart[x].cart.length; y++) {
        let item = myCart[x].cart[y];
        a += item.price * item.qty;
        console.log(a);
      }
    }
    setSubTotal(a);
  };

  useEffect(() => {
    // setAllSelected(false)
    // createMyCartSession('set', testdata)

    console.log("My Cart", myCart)

    // setSelectedItemsArr(myCart)
    getSubTotal();
  }, []);

  useEffect(() => {
    // setAllSelected(false)
    // testData2 = myCart
    // setSelectedItemsArr(myCart)
    // setUnSelectedItemsArr([])
  }, [myCart]);

  const deleteItem = () => {
    // itemIdArr.push(item)
    // alert(JSON.stringify(itemIdArr))
    // if (allSelected){
    //   createMyCartSession('clearAll', [])
    // } else {
    //   createMyCartSession('deleteItems', [])
    // }
    createMyCartSession('removeItems', unSelectedItemsArr)
    setSelectedItemsArr([])
    getSubTotal()
    // setUnSelectedItemsArr([])
    console.log('SELECTED ',selectedItemsArr)
    console.log('UNSELECTED ',unSelectedItemsArr)
  }

  const unSelectItem = (type, raw) => {
    if(type == 'store'){
      if(selectedItemsArr.length == 1 || selectedItemsArr.length == 0){
        selectedItemsArr.splice(0, 1);
      }else {
        let indexOf = selectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        selectedItemsArr.splice(indexOf, 1);
      }
    }else {
      if(selectedItemsArr.length > 1){
        if(selectedItemsArr[raw.storeIndex].cart.length == 1){
          selectedItemsArr.splice(0, 1);
        }
      }else if(selectedItemsArr.length <= 1){
        console.log('UNSELECT CONDTITION 3 ')
        let indexOf = selectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        selectedItemsArr.splice(indexOf, 1);
      }
    }
    if(type == 'store'){
      unSelectedItemsArr.push(raw.item)
    }else {
      if(unSelectedItemsArr.length == 0){
        unSelectedItemsArr.push({store_id: raw.item.store_id, store: raw.item.store, cart: [raw.item]})
      }else{
        let indexOf = unSelectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        console.log(indexOf, raw.item.store_id)
        if(indexOf >= 0){
          unSelectedItemsArr[indexOf].cart.push(raw.item)
        }else {
          unSelectedItemsArr.push({store_id: raw.item.store_id, store: raw.item.store, cart: [raw.item]})
        }
      }
    }
    console.log('SELECTED ',selectedItemsArr)
    console.log('UNSELECTED ',unSelectedItemsArr)
  }

  const selectItem = (type, raw) => {
    if(type == 'store'){
      selectedItemsArr.push(raw.item)
    }else {
      if(selectedItemsArr.length == 0){
        selectedItemsArr.push({store_id: raw.item.store_id, store: raw.item.store, cart: [raw.item]})
      }else{
        let indexOf = selectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        console.log(indexOf, raw.item.store_id)
        if(indexOf >= 0){
          selectedItemsArr[indexOf].cart.push(raw.item)
        }else {
          selectedItemsArr.push({store_id: raw.item.store_id, store: raw.item.store, cart: [raw.item]})
        }
      }
    }
    if(type == 'store'){
      if(unSelectedItemsArr.length == 1 || unSelectedItemsArr.length == 0){
        unSelectedItemsArr.splice(0, 1);
      }else {
        let indexOf = unSelectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        unSelectedItemsArr.splice(indexOf, 1);
      }
    }else {
      if(unSelectedItemsArr.length > 1){
        if(unSelectedItemsArr[raw.storeIndex].cart.length == 1){
            unSelectedItemsArr.splice(0, 1);
        }
      }else if(unSelectedItemsArr.length <= 1){
        let indexOf = unSelectedItemsArr.findIndex(x => x.store_id == raw.item.store_id)
        unSelectedItemsArr.splice(indexOf, 1);
      }
    }
    console.log('SELECTED ',selectedItemsArr)
    console.log('UNSELECTED ',unSelectedItemsArr)
  }

 

  return (
    <>
      <View style={styles.container}>
        <Header label="Shopping Cart" />
        <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
            <View style={{flex: 6, justifyContent: 'center'}}>
              <CheckBox
                isChecked={allSelected}
                rightText="Select All"
                rightTextStyle={{fontSize: 14, fontWeight: '500'}}
                checkedCheckBoxColor="#F6841F"
                uncheckedCheckBoxColor="#F6841F"
                onClick={() => {
                  if(allSelected){
                    //to false
                    setSubTotal(0)
                    // setSelectedItemsArr([])
                    // createMyCartSession('set', [])
                  }else{
                    //to true
                    getSubTotal()
                    // setSelectedItemsArr(testData2)
                    // createMyCartSession('set', myCart)
                  }
                  setAllSelected(!allSelected);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setWillDelete(!willDelete)}
              style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: '#F6841F'}}>{willDelete ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 2, backgroundColor: '#F7F7FA'}} />

          <FlatList
            // data={testdata}
            data = {myCart}
            renderItem={({item, index}) => {
              return (
                <>
                  <RenderDetails 
                    item={item}
                    storeIndex = {index}
                    allSelected={allSelected}
                    onPress={() => {
                      navigation.navigate("ToktokMallStore")
                    }}
                    onStoreSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.total
                        selectItem('store' ,raw)
                      }else{
                        res = subTotal - raw.total
                        unSelectItem('store' ,raw)
                      }
                      setSubTotal(res)
                    }}
                    onItemSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.amount 
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel + 1)
                        selectItem('item' ,raw)
                      }else{
                        res = subTotal - raw.amount
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel - 1)
                        unSelectItem('item', raw)
                      }
                      // if(raw.checked)
                      setSubTotal(res)
                    }} 
                    deleteItem = {deleteItem}
                  />
                  <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
          />

          <View style={{height: 80}}></View>

          {willDelete ? 
          <DeleteFooter onDelete={() => {
            deleteItem(), setMessageModalShown(true), setAllSelected(false), setWillDelete(false)
          }} /> : 
          <CheckoutFooter 
            onSubmit={() => {

              navigation.navigate("ToktokMallCheckout", {data: selectedItemsArr,vouchers: [],unSelectedItemsArr: unSelectedItemsArr})
            }} 
            subtotal={subTotal} 
          />}

          {messageModalShown && 
          <MessageModal 
            type="Success"
            isVisible={messageModalShown}
            setIsVisible={(val) => setMessageModalShown(val)}  
            message={`${itemsToDelete > 1 ? "Items" : "Item"} has been removed from your cart.`}
          />}
            
        </View>
      </View>
    </>
  );
}
// );

const mapStateToProps = (state) => ({
  myCart: state.toktokMall.myCart
})

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export const ToktokMallMyCart = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
