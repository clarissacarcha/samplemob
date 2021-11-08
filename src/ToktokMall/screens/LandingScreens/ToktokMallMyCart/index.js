import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux'
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';

import {MessageModal, LoadingOverlay} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails, RenderEmpty} from './components';
import {MergeStoreProducts, ArrayCopy} from '../../../helpers';
import { create } from 'lodash';
import {useSelector} from 'react-redux';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_MY_CART } from '../../../../graphql/toktokmall/model';
import AsyncStorage from '@react-native-community/async-storage';
import {EventRegister} from 'react-native-event-listeners'

const Component =  ({
  navigation,
  createMyCartCountSession
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
  const [apiloader, setapiloader] = useState(false)
  const [user, setUser] = useState({})
  const [totalitems, settotalitems] = useState(0)
  const [rawitems, setrawitems] = useState([])
  const [selectedItemsArr, setSelectedItemsArr] = useState([])

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const [getMyCartData, {loading, error}] = useLazyQuery(GET_MY_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      // console.log('response', response.getMyCart[0].parsed.data[0].product)
      if(response.getMyCart){
        setMyCartData(response.getMyCart.parsed)
        setrawitems(response.getMyCart.raw)
        settotalitems(response.getMyCart.total)
        createMyCartCountSession("set", response.getMyCart.count)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const init = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        reset()
        setUser(data)        
        getMyCartData({
          variables: {
            input: {
              userId: data.userId
            }
          }
        })     
      }
    })
  }

  const reset = () => {
    setWillDelete(false)
    setAllSelected(false)
    setSubTotal(0)
    setMyCartData([])
    setItemsToCheckoutArr([])
    setItemsToDelArr([])
    setSelectedItemsArr([])
  }

  useEffect(() => {
    init()
    EventRegister.addEventListener('refreshToktokmallShoppingCart', init)
  }, [])

  const onChangeQuantity = (id, qty) => {
    // let items = ArrayCopy(itemsToCheckoutArr)
    let items = ArrayCopy(selectedItemsArr)
    let updatedItems = items.map(item => {
      let newItem = item
      if(item.id === id){
        newItem.qty = qty
        newItem.amount = parseFloat(newItem.product.price * qty)
      }
      return newItem
    })
    // setItemsToCheckoutArr(updatedItems)
    setSelectedItemsArr(updatedItems)
    getSubTotal(updatedItems)
  }

  const getSubTotal = (data) => {
    let temp = data
    let a = 0;
    for (var x = 0; x < temp.length; x++) {
      a = a + temp[x].amount
    }
    setSubTotal(a);
  };

  const deleteMultipleItems = async () => {

    setapiloader(true)
    
    // for (const item of itemsToDelArr) {
    for (const item of selectedItemsArr){
      console.log(item)
      let variables = {
        userid: user.userId,
        shopid: item.shopId,
        branchid: 0,
        productid: [item.id]
      }
      const res = await ApiCall("remove_cart", variables)
      if(res.responseData && res.responseData.success == 1){
        console.log("Multiple Deletion Result #: ", res.responseData)
      }else if(res.responseError){
        console.log(res.responseError)
      }
    }
    
    init()
    setapiloader(false)
    setTimeout(() => {
      setMessageModalShown(true)
    }, 200);

  }

  const deleteSingleItem = async (item) => {

    let variables = {
      userid: user.userId,
      shopid: item.shop.id,
      branchid: 0,
      productid: [item.product.Id]
    }
    console.log(JSON.stringify(variables))
    setapiloader(true)
    const req = await ApiCall("remove_cart", variables, true)
    init()
    setapiloader(false)
    if(req.responseData && req.responseData.success == 1){   
      console.log("Single Deletion Result: ", req.responseData)
      setTimeout(() => {
        setSingleDeletemsgModalShown(true)
      }, 200);
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }

  }

  const selectItem = (raw) => {

    // if(willDelete){
    //   let items = ArrayCopy(itemsToDelArr)
    //   let existing = items.findIndex((e) => e.id == raw.productId)
    //   if(existing == -1){
    //     items.push({
    //       shopid: raw.shopId,
    //       productid: raw.productId
    //     })
    //   }
    //   setItemsToDelArr(items)
    // }else{
      // let items = ArrayCopy(itemsToCheckoutArr)
      // let existing = items.findIndex((e) => e.id == raw.productId)
      // if(existing == -1){
      //   items.push({
      //     id: raw.productId,
      //     shopId: raw.shopId,
      //     product: raw.product,
      //     amount: parseFloat(raw.amount),
      //     qty: raw.qty
      //   })
      // }
      // setItemsToCheckoutArr(items)
      // getSubTotal(items)
    // }
    let items = ArrayCopy(selectedItemsArr)
    let existing = items.findIndex((e) => e.id == raw.productId)
    if(existing == -1){
      items.push({
        id: raw.productId,
        shopId: raw.shopId,
        product: raw.product,
        amount: parseFloat(raw.amount),
        qty: raw.qty
      })
    }
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
  }

  const selectStoreItems = (raw, storeitems) => {
    // if(willDelete){
    //   let items = ArrayCopy(itemsToDelArr)
    //   storeitems.map((storeitem) => {
    //     items.push({          
    //       shopid: storeitem.shopid,
    //       productid: storeitem.product.Id
    //     })
    //   })
    //   setItemsToDelArr(items)
    // }else{
    //   let items = ArrayCopy(itemsToCheckoutArr)
    //   storeitems.map((storeitem) => {
    //     let existing = items.findIndex((e) => e.id == storeitem.product.Id)
    //     if(existing == -1){
    //       items.push({
    //         id: storeitem.product.Id,
    //         shopId: storeitem.shopid,
    //         product: storeitem.product,
    //         amount: parseFloat(storeitem.product.price * storeitem.quantity),
    //         qty: storeitem.quantity
    //       })
    //     }
    //   })
    //   setItemsToCheckoutArr(items)
    //   getSubTotal(items)
    // }
    let items = ArrayCopy(selectedItemsArr)
    storeitems.map((storeitem) => {
      let existing = items.findIndex((e) => e.id == storeitem.product.Id)
      if(existing == -1){
        items.push({
          id: storeitem.product.Id,
          shopId: storeitem.shopid,
          product: storeitem.product,
          amount: parseFloat(storeitem.product.price * storeitem.quantity),
          qty: storeitem.quantity
        })
      }
    })
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
  }

  const unSelectitem = (raw) => {
    
    // if(willDelete){
    //   let items = ArrayCopy(itemsToDelArr)
    //   let itemIndex = items.findIndex((e) => e.productid == raw.productId)
    //   if(itemIndex > -1){
    //     items.splice(itemIndex, 1)
    //   }
    //   setItemsToDelArr(items)
    // }else{
    //   let items = ArrayCopy(itemsToCheckoutArr)
    //   let itemIndex = items.findIndex((e) => e.id == raw.productId)
    //   if(itemIndex > -1){
    //     items.splice(itemIndex, 1)
    //   }
    //   setItemsToCheckoutArr(items)
    //   getSubTotal(items)
    // }
    let items = ArrayCopy(selectedItemsArr)
    let itemIndex = items.findIndex((e) => e.id == raw.productId)
    if(itemIndex > -1){
      items.splice(itemIndex, 1)
    }
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
  }

  const unSelectStoreItems = (raw, storeitems) => {
    
    // if(willDelete){
    //   let items = ArrayCopy(itemsToDelArr)
    //   storeitems.map((storeitem) => {
    //     console.log(storeitem)
    //     let itemIndex = items.findIndex((e) => e.productid == storeitem.product.Id)
    //     if(itemIndex > -1){
    //       items.splice(itemIndex, 1)
    //     }
    //   })
    //   setItemsToDelArr(items)
    // }else{
    //   let items = ArrayCopy(itemsToCheckoutArr)
    //   storeitems.map((storeitem) => {
    //     // console.log(storeitems)
    //     let itemIndex = items.findIndex((e) => e.id == storeitem.product.Id)
    //     // console.log(itemIndex)
    //     if(itemIndex > -1){
    //       items.splice(itemIndex, 1)
    //     }
    //     // console.log('produced result', items)
    //   })
    //   setItemsToCheckoutArr(items)
    //   getSubTotal(items)
    // }
    let items = ArrayCopy(selectedItemsArr)
    storeitems.map((storeitem) => {
      // console.log(storeitems)
      let itemIndex = items.findIndex((e) => e.id == storeitem.product.Id)
      // console.log(itemIndex)
      if(itemIndex > -1){
        items.splice(itemIndex, 1)
      }
      // console.log('produced result', items)
    })
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
  }

  const selectAllItems = () => {
    
    // if(willDelete){
    //   setItemsToDelArr(rawitems)
    // }else{
      let allitems = rawitems.map((item) => {
        // let checkoutitems = ArrayCopy(itemsToCheckoutArr)
        let checkoutitems = ArrayCopy(selectedItemsArr)
        //CHECK IF ITEM IS ALREADY SELECTED
        let itemIndex = checkoutitems.findIndex((e) => e.id == item.productid)
        if(itemIndex > - 1){
          //ITEM ALREADY EXIST
          let existingitem = checkoutitems[itemIndex]
          return {
            id: item.productid,
            shopId: item.shopid,
            product: item.product,
            amount: parseFloat(existingitem.product.price * existingitem.qty),
            qty: existingitem.qty
          }
        }else{
          //ITEM NOT EXIST, PUSH THE DATA FROM DATABASE
          return {
            id: item.productid,
            shopId: item.shopid,
            product: item.product,
            amount: parseFloat(item.product.price * item.quantity),
            qty: item.quantity
          }
        }
      })
      // setItemsToCheckoutArr(allitems)
      // getSubTotal(allitems)
      setSelectedItemsArr(allitems)
      // if(!willDelete){
        getSubTotal(allitems)
      // }
    // }

  }

  const unSelectAllitems = () => {
    
    // if(willDelete){
    //   setItemsToDelArr([])
    // }else{
    //   setItemsToCheckoutArr([])
    //   setSubTotal(0)
    // }
    setSelectedItemsArr([])
    // if(!willDelete){
      setSubTotal(0)
    // }
  }

  const onItemLongPress = (raw) => {
    // 
    // setItemsToCheckoutArr([])
    // let items = ArrayCopy(itemsToDelArr)
    // let items = ArrayCopy(selectedItemsArr)
    // let existing = items.findIndex((e) => e.id == raw.productId)
    // if(existing == -1){
    //   items.push({
    //     shopid: raw.shopId,
    //     productid: raw.productId
    //   })
    // }
    // // setItemsToDelArr(items)
    // setSelectedItemsArr(items)
    let items = ArrayCopy(selectedItemsArr)
    let existing = items.findIndex((e) => e.id == raw.productId)
    if(existing == -1){
      items.push({
        id: raw.productId,
        shopId: raw.shopId,
        product: raw.product,
        amount: parseFloat(raw.amount),
        qty: raw.qty
      })
    }
    // console.log(items)
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
    setWillDelete(raw.checked)
  }

  const FormatCheckoutItems = () => {

    let cartData = ArrayCopy(myCartData)
    // let checkoutItems = ArrayCopy(itemsToCheckoutArr)
    let checkoutItems = ArrayCopy(selectedItemsArr)
    let result = []
    
    cartData.map((cartitem) => {
      
      let findshopitems = checkoutItems.find((e) => e.shopId == cartitem.shop.id)

      if(findshopitems){

        let shopitems = checkoutItems.filter((e) => e.shopId == cartitem.shop.id)
        let shopalreadyadded = result.findIndex((e) => e.shop.id == shopitems.shopId)

        if(shopalreadyadded > -1){
          result[shopalreadyadded].data.push(shopitems)
        }else{
          result.push({
            shop: cartitem.shop,
            data: [shopitems]
          })
        }
        
      }

    })
    return result
    // console.log("Result", JSON.stringify(result))
  }

  const OnSubmitForCheckout = () => {
    // if(itemsToCheckoutArr.length > 0){
      
    if(selectedItemsArr.length > 0){
      
      let data = FormatCheckoutItems()
      navigation.navigate("ToktokMallCheckout", {
        type: "from_cart",
        data: data,
        subTotal: subTotal,
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

          {loading && <LoadingOverlay isVisible={loading} />}
          {apiloader && <LoadingOverlay isVisible={apiloader} />}

          {myCartData.length == 0 && !loading && !apiloader && <RenderEmpty />}

          {myCartData.length > 0 && 
          <>
          <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
            <View style={{flex: 6, justifyContent: 'center'}}>
              <CheckBox
                // isChecked={allSelected || itemsToCheckoutArr.length == totalitems}
                isChecked={allSelected || selectedItemsArr.length == totalitems}
                rightText="Select All"
                rightTextStyle={{fontSize: 14, fontWeight: '500'}}
                checkedCheckBoxColor="#F6841F"
                uncheckedCheckBoxColor="#F6841F"
                onClick={() => {
                  if(allSelected){
                    //to false
                    unSelectAllitems()
                  }else{
                    //to true
                    selectAllItems()
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
                  // setSelectedItemsArr([])
                  // setSubTotal(0)
                }else {
                  setAllSelected(false)
                  init()
                }
                setWillDelete(!willDelete)
              }}
              style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: '#F6841F'}}>{willDelete ? 'Cancel' : ''}</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
          
          <FlatList
            data={myCartData}
            renderItem={({item, index}) => {
              return (
                <>
                  <RenderDetails 
                    item={item}
                    allSelected={allSelected}
                    refreshing={loading}
                    willDelete={willDelete}
                    onPress={() => {
                      navigation.navigate("ToktokMallStore", {id: item.shop.id})
                    }}
                    onStoreSelect={(raw, items) => {
                      if(raw.checked){
                        selectStoreItems(raw, items)
                      }else{
                        unSelectStoreItems(raw, items)
                      }
                    }}
                    onItemSelect={(raw) => {
                      if(raw.checked){
                        selectItem(raw)
                      }else{
                        unSelectitem(raw)
                      }
                    }}
                    onItemLongPress={(raw) => {
                      // setWillDelete(raw.checked)
                      if(raw.checked){
                        onItemLongPress(raw)
                      }else{
                        unSelectitem(raw)
                      }
                    }}
                    onItemDelete={(item) => {
                      deleteSingleItem(item)
                    }}
                    onChangeQuantity={(qty, id) => {
                      onChangeQuantity(id, qty)
                    }}
                  />
                  <View style={{height: 6, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => init()} />}
          />
          </>
          }

          {myCartData.length > 0 && <View style={{height: 80}}></View>}

          {myCartData.length > 0 && willDelete && 
          <DeleteFooter 
            onDelete={() => {
              deleteMultipleItems()
            }} 
          />}

          {myCartData.length > 0 && !willDelete && 
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
            setIsVisible={(val) => {
              setMessageModalShown(val)
            }}  
            message={`Items has been removed from your cart.`}
          />}

          {singleDeletemsgModalShown && 
          <MessageModal 
            type="Success"
            isVisible={singleDeletemsgModalShown}
            setIsVisible={(val) => {
              setSingleDeletemsgModalShown(val)
            }}  
            message={`Item has been removed from your cart.`}
          />}
            
        </View>
      </View>
    </>
  );
}
// );

const mapStateToProps = (state) => ({
  cartNoOfItems: state.toktokMall.myCartCount
})

const mapDispatchToProps = (dispatch) => ({
  createMyCartCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_CART_COUNT', action, payload})
});

export const ToktokMallMyCart = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
