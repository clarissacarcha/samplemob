import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux'
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';

import {MessageModal, LoadingOverlay} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails, RenderEmpty} from './components';
import {MergeStoreProducts} from '../../../helpers';
import { create } from 'lodash';
import {useSelector} from 'react-redux';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_MY_CART } from '../../../../graphql/toktokmall/model';
import AsyncStorage from '@react-native-community/async-storage';

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
  const [myCartData, setMyCartData] = useState([])  
  const session = useSelector(state=> state.session)
  const [user, setUser] = useState({})

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const [getMyCartData, {loading, error}] = useLazyQuery(GET_MY_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log(response)
      if(response.getMyCart){
        setMyCartData(response.getMyCart)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const getMyCart = async () => {
    
    // createMyCartSession('push', raw)
    // setCartItems(CountCartItems)
    // setMessageModalShown(true)

    let variables = {
      userid: 8642,
     
    }          
    console.log(variables)
    const req = await ApiCall("get_cart_data", variables, true)
    console.log('cart request is this', req)
    // if(req.responseData && req.responseData.success == 1){
    //   // createMyCartSession('push', raw)
    //   // setCartItems(CountCartItems)
    //   setMyCartData(req.responseData.data)
    // }else if(req.responseError && req.responseError.success == 0){
    //   Toast.show(req.responseError.message, Toast.LONG)
    // }else if(req.responseError){
    //   Toast.show("Something went wrong", Toast.LONG)
    // }else if(req.responseError == null && req.responseData == null){
    //   Toast.show("Something went wrong", Toast.LONG)
    // }
  }

  useEffect(() => {    
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      console.log('from async', data)
      if(data.userId){
        getMyCart()
        
      }
    })
  }, []);

  useEffect(()=> {
    if(itemsToCheckoutArr && itemsToCheckoutArr.length !== 0){
      getSubTotal(itemsToCheckoutArr)
    }else if(itemsToCheckoutArr && itemsToCheckoutArr.length === 0){
      setSubTotal(0)
    }
  }, [itemsToCheckoutArr])

  const onChangeQuantity = (id, qty) => {
    let currentItems = itemsToCheckoutArr
    setItemsToCheckoutArr(currentItems.map(item => {
      let newItem = item
      if(item.item_id === id){
        newItem.qty = qty
      }
      return newItem
    }))
  }

  const getSubTotal = async (data) => {
    let temp = data || myCart
    let a = 0;
    for (var x = 0; x < temp.length; x++) {
        let _item = temp[x];
        a += parseFloat(_item.price) * _item.qty;
    }
    setSubTotal(a);
  };

  useEffect(() => {
    // console.log("My Cart", myCart)
    // getSubTotal();

    //Call to reset cart for debugging
    // createMyCartSession('set', [])
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        setUser(data)
      }
    })
  }, []);

  useEffect(() => {
    setMyCartData(myCart)
  }, [myCart])

  const deleteMultipleItems = () => {
    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    if(allSelected){
      createMyCartSession("set", [])
    }else{
      createMyCartSession("DeleteMultiple", itemsToDelArr)
      itemsToDelArr.map((item, i) => {
        //Check if item already exist on current items
        let index = currentItems.findIndex((a) => a.item_id == item.item_id)
        currentItems.splice(index, 1)
      })
      setItemsToCheckoutArr(currentItems)
    }
    // getSubTotal()
  }

  const deleteSingleItem = (id) => {
    createMyCartSession("DeleteSingle", {item_id: id.item_id})

    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))

    let index = willDeleteItems.findIndex((a) => a.item_id === id.item_id)
    willDeleteItems.splice(index, 1)
    setItemsToDelArr(willDeleteItems)


    let indexC = currentItems.findIndex((a) => a.item_id === id.item_id)
    currentItems.splice(indexC, 1)
    setItemsToCheckoutArr(currentItems)
    setSingleDeletemsgModalShown(true)
    // getSubTotal()
  }

  const deleteItems = async (type, singleItem) => {
    let variables = {
      userid: user.id,
      shopid: singleItem.store_id,
      branchid: 0,
      productid: [singleItem.item_id]
    }
    // data.pin = value
    console.log(variables)
    const req = await ApiCall("remove_cart", variables, true)

    if(req.responseData && req.responseData.success == 1){
      if(type == 'single'){
        //single item delete
        deleteSingleItem(singleItem)
      }else {
        //multiple delete
      }
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }

  }

  const unSelectItem = (type, raw, del) => {

    //Must create a copy of itemstocheckout array with a new instance
    //to prevent bugs
    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))
    
    if(type == "item"){
      if(willDelete || del){
        let indexC = currentItems.findIndex((a) => a.item_id == raw.item.item_id)
        currentItems.splice(indexC, 1)
        setItemsToCheckoutArr(currentItems)
        let index = willDeleteItems.findIndex((a) => a.item_id == raw.item.item_id)
        willDeleteItems.splice(index, 1)
        setItemsToDelArr(willDeleteItems)
      }else{
        let index = currentItems.findIndex((a) => a.item_id == raw.item.item_id)
        currentItems.splice(index, 1)
        setItemsToCheckoutArr(currentItems)
      }
    }else if(type == "store"){
      if(willDelete || del){
        
        //Map raw items
        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let index = willDeleteItems.findIndex((a) => a.item_id == item.item_id)
          willDeleteItems.splice(index, 1)
        })
        setItemsToDelArr(willDeleteItems)

        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let index = currentItems.findIndex((a) => a.item_id == item.item_id)
          currentItems.splice(index, 1)
        })
        setItemsToCheckoutArr(currentItems)

      }else{

        //Map raw items
        raw.items.map((item, i) => {
          //Check if item already exist on current items
          let index = currentItems.findIndex((a) => a.item_id == item.item_id)
          currentItems.splice(index, 1)
        })
        getSubTotal(currentItems)
        setItemsToCheckoutArr(currentItems)
      }
    }

    // console.log("Items to checkout", itemsToCheckoutArr.length)

  }

  const selectItem = (type, raw, del) => {

    //Must create a copy of itemstocheckout array with a new instance
    //to prevent bugs
    let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))
    
    if(type == "item"){
      if(willDelete || del){
        willDeleteItems.push(raw.item)
        setItemsToDelArr(willDeleteItems)
      }else{
        currentItems.push(raw.item)
        setItemsToCheckoutArr(currentItems)
      }
    }else if(type == "store"){
      if(willDelete || del){

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

          {myCart.length == 0 && <RenderEmpty />}

          {myCart.length > 0 && 
          <>
          <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
            <View style={{flex: 6, justifyContent: 'center'}}>
              <CheckBox
                isChecked={!willDelete ? itemsToCheckoutArr.length === myCart.length : itemsToDelArr.length === myCart.length}
                rightText="Select All"
                rightTextStyle={{fontSize: 14, fontWeight: '500'}}
                checkedCheckBoxColor="#F6841F"
                uncheckedCheckBoxColor="#F6841F"
                onClick={() => {
                  if(allSelected){
                    //to false
                    setItemsToCheckoutArr([])
                  }else{
                    //to true
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
                  // setItemsToDelArr(itemsToCheckoutArr)
                  setItemsToCheckoutArr([])
                  setItemsToDelArr([])
                }
                setWillDelete(!willDelete)
              }}
              style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: '#F6841F'}}>{willDelete ? 'Cancel' : ''}</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
          
          <FlatList
            // data={testdata}
            data={MergeStoreProducts(myCartData)}
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
                        // res = subTotal + raw.total
                        selectItem('store' , raw, willDelete)
                      }else{
                        // res = subTotal - raw.total
                        unSelectItem('store' , raw, willDelete)
                      }
                      // setSubTotal(res)
                    }}
                    onItemSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        selectItem('item' , raw, false)
                      }else{
                        unSelectItem('item', raw, false)
                      }
                      // if(raw.checked)
                    }} 
                    onItemLongPress={(raw) => {

                      setWillDelete(true)
                      
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.amount
                        selectItem('item' , raw, true)
                      }else{
                        res = subTotal - raw.amount
                        unSelectItem('item', raw, true)
                      }
                      // if(raw.checked)
                      setSubTotal(res)
                    }}
                    onItemDelete={(id) => {
                      deleteItems('single', id)
                    }}
                    onChangeQuantity={(qty, id) => {
                      console.log("change quantity", id)
                      onChangeQuantity(id, qty)
                      createMyCartSession("UpdateQuantity", {item_id: id, qty: qty})
                    }}
                  />
                  <View style={{height: 6, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}            
          />
          </>
          }

          {myCart.length > 0 && <View style={{height: 80}}></View>}

          {myCart.length > 0 && willDelete && 
          <DeleteFooter 
            onDelete={() => {
              deleteMultipleItems()
              setMessageModalShown(true)
              setAllSelected(false)
              setWillDelete(false)
            }} 
          />}

          {myCart.length > 0 && !willDelete && 
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
            message={`${itemsToDelArr.length > 1 || willDelete ? "Items" : "Item"} has been removed from your cart.`}
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
