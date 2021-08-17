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
  const [allSelected, setAllSelected] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const [messageModalShown, setMessageModalShown] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [itemsToDelete, setItemsToDelete] = useState(0)
  const [selectedItemsToDelArr, setSelectedItemsToDelArr] = useState([])
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
    // console.log("My Cart", myCart)
    // getSubTotal();

    //Call to reset cart for debugging
    // createMyCartSession('set', [])
  }, []);

  const formatItemsForCheckout = () => {
    console.log(itemsToCheckoutArr)
    let cartCopy = JSON.parse(JSON.stringify(myCart))
    let remainCart = JSON.parse(JSON.stringify(myCart))
    let tempCart = []

    itemsToCheckoutArr.map((item, i) => {
      //first check if shop exists on temp cart
      let tempArrShopIdx = tempCart.findIndex(x => x.store_id == item.store_id)
      if(tempArrShopIdx > -1){
        //shop exists, check if item already exist from cart
        let itemIndex = tempCart[tempArrShopIdx].cart.findIndex(x => x.item_id == item.item_id)
        if(itemIndex > -1){
          //if item already exist, do nothing
        }else{
          //if item doesn't exist, push the item to shop cart
          tempCart[tempArrShopIdx].cart.push(item)
          // tempCart[tempArrShopIdx].cart[item.itemIndex] = item

        }
      }else{
        //if not exist, push the shop and item to temp cart array
        let itemIndex = cartCopy[item.shopIndex].cart.findIndex(x => x.item_id == item.item_id)
        if(itemIndex > -1) {
          cartCopy[item.shopIndex].cart = [cartCopy[item.shopIndex].cart[itemIndex]]
        }
        tempCart.push(cartCopy[item.shopIndex])
      }
    })
    setCheckoutData(tempCart)
    console.log("Formatted items for checkout", JSON.stringify(tempCart))

    //GET REMAINED ITEMS
    itemsToCheckoutArr.forEach((item, i) => {
      remainCart[item.shopIndex].cart.splice(item.itemIndex, 1)
      if(remainCart[item.shopIndex].cart.length == 0){
        remainCart.splice(item.shopIndex, 1)
      }
    })

    console.log("Remained items when checkout complete", JSON.stringify(remainCart))

    if(tempCart.length == 0) return
    navigation.navigate("ToktokMallCheckout", {
      type: "from_cart",
      data: tempCart,
      newCart: remainCart,
      vouchers: [],
    })
    
  }

  const deleteItem = () => {

    let cartCopy = JSON.parse(JSON.stringify(myCart))

    selectedItemsToDelArr.forEach((item, i) => {      
      if(cartCopy.length == 0) return
      cartCopy[item.shopIndex].cart.splice(item.itemIndex, 1)
      if(cartCopy[item.shopIndex].cart.length == 0){
        cartCopy.splice(item.shopIndex, 1)
      }
    })

    console.log("Deletion result", cartCopy)
    createMyCartSession('set', cartCopy)
    // getSubTotal()
  }

  const unSelectItem = (type, raw) => {

    let selectedItemsToDelArrCopy = selectedItemsToDelArr
    let itemsToCheckoutArrCopy = itemsToCheckoutArr

    if(type == "item"){  

      if(willDelete){

        let itemIndex = selectedItemsToDelArrCopy.findIndex(x => x.item_id == raw.item.item_id)
        if(itemIndex > -1){
          selectedItemsToDelArrCopy.splice(itemIndex, 1)
          setSelectedItemsToDelArr(selectedItemsToDelArrCopy)
        }

      }else{

        let itemIndex = itemsToCheckoutArrCopy.findIndex(x => x.item_id == raw.item.item_id)
        if(itemIndex > -1){
          itemsToCheckoutArrCopy.splice(itemIndex, 1)
          setItemsToCheckoutArr(itemsToCheckoutArrCopy)
        }

      }
    }
    console.log("Selected Items to delete", selectedItemsToDelArrCopy)
    console.log("Selected Items to checkout", itemsToCheckoutArrCopy)

  }

  const selectItem = (type, raw) => {
    
    
    let selectedItemsToDelArrCopy = selectedItemsToDelArr
    let itemsToCheckoutArrCopy = itemsToCheckoutArr

    if(type == "item"){
      
      if(willDelete){

        let itemDetails = getItemDetailsByIndexId(raw.item.store_id, raw.item.item_id)
        selectedItemsToDelArrCopy.push(itemDetails)
        setSelectedItemsToDelArr(selectedItemsToDelArrCopy)

      }else{
        
        let itemDetails = getItemDetailsByIndexId(raw.item.store_id, raw.item.item_id)
        itemsToCheckoutArrCopy.push(itemDetails)
        setItemsToCheckoutArr(itemsToCheckoutArrCopy)

      }
    }

    console.log("Selected Items to delete", selectedItemsToDelArrCopy)
    console.log("Selected Items to checkout", itemsToCheckoutArrCopy)

  }

  const getItemDetailsByIndexId = (storeId, itemId) => {
    let cartCopy = JSON.parse(JSON.stringify(myCart))
    let cartIndex = cartCopy.findIndex(x => x.store_id == storeId)
    let cartArr = cartCopy[cartIndex].cart
    let itemIndex = cartArr.findIndex(x => x.item_id == itemId)
    let itemDetails = cartArr[itemIndex]
    return {
      shopIndex: cartIndex,
      itemIndex: itemIndex,
      ...itemDetails
    }
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
              onPress={() => {
                setWillDelete(!willDelete)
                if(willDelete){
                  setAllSelected(false)
                }
              }}
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
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel + 1)
                        selectItem('item' , raw)
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
                  <View style={{height: 6, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
          />

          <View style={{height: 80}}></View>

          {willDelete ? 
          <DeleteFooter 
            onDelete={() => {
              deleteItem()
              setMessageModalShown(true)
              setAllSelected(false)
              setWillDelete(false)
            }} 
          /> : 
          <CheckoutFooter 
            onSubmit={async () => {
              await formatItemsForCheckout()      
            }} 
            subtotal={subTotal}

          />}

          {messageModalShown && 
          <MessageModal 
            type="Success"
            isVisible={messageModalShown}
            setIsVisible={(val) => setMessageModalShown(val)}  
            message={`${selectedItemsToDelArr.length > 1 ? "Items" : "Item"} has been removed from your cart.`}
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
