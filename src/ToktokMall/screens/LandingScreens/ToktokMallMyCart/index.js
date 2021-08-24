import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux'
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';

import {MessageModal} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails} from './components';
import {MergeStoreProducts} from '../../../helpers';
import { create } from 'lodash';

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
  const [allSelected, setAllSelected] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const [messageModalShown, setMessageModalShown] = useState(false);
  const [singleDeletemsgModalShown, setSingleDeletemsgModalShown] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [itemsToDelArr, setItemsToDelArr] = useState([])
  const [itemsToCheckoutArr, setItemsToCheckoutArr] = useState([])
  const [checkoutData, setCheckoutData] = useState([])

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const getSubTotal = async () => {
    let a = 0;
    for (var x = 0; x < myCart.length; x++) {
      for (var y = 0; y < myCart[x].cart.length; y++) {
        let _item = myCart[x].cart[y];
        a += parseFloat(_item.price) * _item.qty;
      }
    }
    setSubTotal(a);
  };

  useEffect(() => {
    console.log("My Cart", myCart)
    // getSubTotal();

    //Call to reset cart for debugging
    // createMyCartSession('set', [])
  }, []);

  const deleteMultipleItems = () => {
    console.log("Items to delete", itemsToDelArr)
    createMyCartSession("DeleteMultiple", itemsToDelArr)
    // getSubTotal()
  }

  const deleteSingleItem = (id) => {
    createMyCartSession("DeleteSingle", {item_id: id})
    setSingleDeletemsgModalShown(true)
    // getSubTotal()
  }

  const unSelectItem = (type, raw) => {

    //Must create a copy of itemstocheckout array with a new instance
    //to prevent bugs
    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))
    
    if(type == "item"){
      if(willDelete){
        let index = willDeleteItems.findIndex((a) => a.item_id == raw.item.item_id)
        willDeleteItems.splice(index, 1)
        setItemsToDelArr(willDeleteItems)
      }else{
        let index = currentItems.findIndex((a) => a.item_id == raw.item.item_id)
        currentItems.splice(index, 1)
        setItemsToCheckoutArr(currentItems)
      }
    }else if(type == "store"){
      if(willDelete){
        
        //Map raw items
        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let index = willDeleteItems.findIndex((a) => a.item_id == item.item_id)
          willDeleteItems.splice(index, 1)
        })
        setItemsToDelArr(willDeleteItems)

      }else{

        //Map raw items
        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let index = currentItems.findIndex((a) => a.item_id == item.item_id)
          currentItems.splice(index, 1)
        })
        setItemsToCheckoutArr(currentItems)
      }
    }

    // console.log("Items to checkout", itemsToCheckoutArr.length)

  }

  const selectItem = (type, raw) => {

    //Must create a copy of itemstocheckout array with a new instance
    //to prevent bugs
    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))
    
    if(type == "item"){
      if(willDelete){
        willDeleteItems.push(raw.item)
        setItemsToDelArr(willDeleteItems)
      }else{
        currentItems.push(raw.item)
        setItemsToCheckoutArr(currentItems)
      }
    }else if(type == "store"){
      if(willDelete){

         //Map raw items
         raw.items.map((item, i) => {
          //Check if item already exist on current items
          let exist = willDeleteItems.findIndex((a) => a.item_id == item.item_id)
          if(exist > -1){
            //if already exist, skip
          }else{
            willDeleteItems.push(item)
          }
        })
        setItemsToCheckoutArr(willDeleteItems)

      }else{

        //Map raw items
        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let exist = currentItems.findIndex((a) => a.item_id == item.item_id)
          if(exist > -1){
            //if already exist, skip
          }else{
            currentItems.push(item)
          }
        })
        setItemsToCheckoutArr(currentItems)
      }
    }

    // console.log("Items to checkout", itemsToCheckoutArr.length)


  }

  const OnSubmitForCheckout = () => {
    if(itemsToCheckoutArr.length > 0){
      navigation.navigate("ToktokMallCheckout", {
        type: "from_cart",
        data: MergeStoreProducts(itemsToCheckoutArr),
        newCart: [],
        vouchers: [],
      })
    }else{
      Toast.show("Please select items to checkout", Toast.LONG)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Header label="Shopping Cart" />
        <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
        <View style={{flex: 1}}>

          {myCart.length > 0 && 
          <>
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
                    setItemsToCheckoutArr([])
                  }else{
                    //to true
                    getSubTotal()
                    setItemsToCheckoutArr(myCart)
                  }
                  setAllSelected(!allSelected);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if(!willDelete == true){
                  //Copy items selected by user from to checkout array
                  setItemsToDelArr(itemsToCheckoutArr)
                }
                setWillDelete(!willDelete)
              }}
              style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: '#F6841F'}}>{willDelete ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
          </>
          }

          <FlatList
            // data={testdata}
            data={MergeStoreProducts(myCart)}
            renderItem={({item, index}) => {
              return (
                <>
                  <RenderDetails 
                    item={item}
                    storeIndex = {index}
                    allSelected={allSelected}
                    onPress={() => {
                      navigation.navigate("ToktokMallStore", {id: item.store_id})
                    }}
                    onStoreSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.total
                        selectItem('store' , raw)
                      }else{
                        res = subTotal - raw.total
                        unSelectItem('store' , raw)
                      }
                      setSubTotal(res)
                    }}
                    onItemSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.amount
                        selectItem('item' , raw)
                      }else{
                        res = subTotal - raw.amount
                        unSelectItem('item', raw)
                      }
                      // if(raw.checked)
                      setSubTotal(res)
                    }} 
                    onItemDelete={(id) => {
                      deleteSingleItem(id)
                    }}
                    onChangeQuantity={(qty, id) => {
                      console.log("change quantity", id)
                      createMyCartSession("UpdateQuantity", {item_id: id, qty: qty})
                    }}
                  />
                  <View style={{height: 6, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Your cart is empty</Text>
                  </View>
                </>
              )
            }}
          />

          <View style={{height: 80}}></View>

          {willDelete ? 
          <DeleteFooter 
            onDelete={() => {
              deleteMultipleItems()
              setMessageModalShown(true)
              setAllSelected(false)
              setWillDelete(false)
            }} 
          /> : 
          <CheckoutFooter 
            onSubmit={async () => {
              await OnSubmitForCheckout()
            }} 
            subtotal={subTotal}

          />}

          {messageModalShown && 
          <MessageModal 
            type="Success"
            isVisible={messageModalShown}
            setIsVisible={(val) => setMessageModalShown(val)}  
            message={`${itemsToDelArr.length > 1 ? "Items" : "Item"} has been removed from your cart.`}
          />}

          {singleDeletemsgModalShown && 
          <MessageModal 
            type="Success"
            isVisible={singleDeletemsgModalShown}
            setIsVisible={(val) => setSingleDeletemsgModalShown(val)}  
            message={`Item has been removed from your cart.`}
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
