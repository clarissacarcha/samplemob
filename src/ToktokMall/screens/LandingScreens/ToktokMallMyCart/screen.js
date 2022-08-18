import React, {useState, useEffect, useContext, useRef, createRef} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, RefreshControl, BackHandler} from 'react-native';
import {connect, useDispatch} from 'react-redux'
import {HeaderBack, HeaderTitle, HeaderRight, Header, CustomModal} from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';

import {MessageModal, LoadingOverlay} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails, RenderEmpty} from './components';
import {MergeStoreProducts, ArrayCopy, getRefComAccountType} from '../../../helpers';
import { create, map, set } from 'lodash';
import {useSelector} from 'react-redux';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_MY_CART, GET_VERIFY_CHECKOUT } from '../../../../graphql/toktokmall/model';
import AsyncStorage from '@react-native-community/async-storage';
import {EventRegister} from 'react-native-event-listeners';

import { CartContext, CartContextProvider } from './ContextProvider';
import { useFocusEffect } from '@react-navigation/core';

const Component = ({
  route,
  navigation,
  createMyCartCountSession
}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const session = useSelector(state=>state.session)
  const CartContextData = useContext(CartContext)
  const {customModal, customConfirmModal} = useSelector(state=> state.toktokMall)

  const [itemsToDelArr, setItemsToDelArr] = useState([])
  const [itemsToCheckoutArr, setItemsToCheckoutArr] = useState([])
  const [checkoutData, setCheckoutData] = useState([])
  const [willDelete, setWillDelete] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [myCartData, setMyCartData] = useState([])  
  const [apiloader, setapiloader] = useState(false)
  const [user, setUser] = useState({})
  const [totalitems, settotalitems] = useState(0)
  const [rawitems, setrawitems] = useState([])
  const [selectedItemsArr, setSelectedItemsArr] = useState([])
  const [swiperReferences, setSwiperReferences] = useState([])
  const [preSelectedItems, setPreSelectedItems] = useState([])
  const dispatch = useDispatch()

  const swiperRefs = useRef([])

  const [getMyCartData, {loading, error}] = useLazyQuery(GET_MY_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      // console.log('response', response.getMyCart[0].parsed.data[0].product)
      if(response.getMyCart){
        let count = 0;
        response.getMyCart.parsed.map(({data}) => {
          data.map(item => {
            if(item.product.enabled === 1 && item.product.noOfStocks !== 0){
              count+=item.quantity
            }else if(item.product.enabled === 1 && item.product.noOfStocks <= 0 && item.product.contSellingIsset === 1){
              count+=item.quantity
            }
          })
        })
        dispatch({ type: "TOKTOK_MALL_CART_COUNT", action: "set", payload: count})
        setMyCartData(response.getMyCart.parsed)
        setrawitems(response.getMyCart.raw)
        let total = 0
        response.getMyCart.parsed.map(({data}) => {
          data.map(item => {
            if(item.product.enabled === 1 && item.product.noOfStocks !== 0){
              total++
            }else if(item.product.enabled === 1 && item.product.noOfStocks <= 0 && item.product.contSellingIsset === 1){
              total++
            }
          })
        })
        settotalitems(total)

        if(response.getMyCart.total > 0){
          //GENERATE ARRAY OF REFERENCES FOR MANIPULATING SWIPEABLE VIEW BASED ON TOTAL CART ITEMS
          swiperRefs.current = Array(response.getMyCart.total - 1).fill().map((_, i) => swiperRefs.current[i] || createRef());        
          let swiperrefcopy = ArrayCopy(swiperReferences)
          for(var x=0;x<response.getMyCart.raw.length;x++){
            let item = response.getMyCart.raw[x]
            //TRACKING AND USING EACH REFERENCES WILL BE PROCESSED BY CHECKING PRODUCT ID
            //INDEX WILL BE USED FOR REFERENCING
            swiperrefcopy.push({id: item.productid, index: x})
          }
          setSwiperReferences(swiperrefcopy)
        }

        //SETUP INITIAL QUANTITIES AND TRACK THEIR VALUES BY PRODUCT ID
        if(CartContextData.itemQuantity.length == 0){
          let initialQty = ArrayCopy(CartContextData.itemQuantity)
          response.getMyCart.raw.map(item => {      
            initialQty.push({id: item.productid, value: item.quantity})
          })
          CartContextData.setItemQuantity(initialQty)
        }

      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [getVerifyCheckout, {loading2, error2}] = useLazyQuery(GET_VERIFY_CHECKOUT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      setapiloader(false)
      if(response.getVerifyCheckout){

        if(response.getVerifyCheckout.isValid == 1){
          await OnSubmitForCheckout();
        }else{
          init()
        }

      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const init = async () => {
    CartContextData.setWillDelete(false);
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        reset()
        setUser(data)        
        getMyCartData({
          variables: {
            input: {
              userId: data.userId,
              refCom: getRefComAccountType({session})
            }
          }
        })     
      }
    })
  }

  const reset = () => {
    setWillDelete(false)
    CartContextData.setSelectAll(false)
    CartContextData.setSelectedFrom('')
    setSubTotal(0)
    setMyCartData([])
    setPreSelectedItems([])
    setItemsToCheckoutArr([])
    setItemsToDelArr([])
    setSelectedItemsArr([])
    // set
  }

  useEffect(() => {
    init()
    EventRegister.addEventListener('refreshToktokmallShoppingCart', init)
  }, [])

  // Read changes in route params and myCartData. This will trigger our way of selecting items from buy again function.
  useEffect(() => {
    getPreItems();
  }, [route.params, myCartData])

  useEffect(() => {
    if(selectedItemsArr && selectedItemsArr.length > 0) {
      let items = ArrayCopy(selectedItemsArr);
      let checker = items.filter(item => item === null);
      if(checker.length > 0) {
        let newItems = items.filter(item => item !== null);
        setSelectedItemsArr(newItems)
      }
    }
  }, [selectedItemsArr])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // navigation.pop(2)
        // alert(JSON.stringify(customModal.visible))
        if(customModal.visible || customConfirmModal.visible){
          dispatch({type:'TOKTOK_MALL_CLOSE_MODAL'})
          return true
        }
        else{
          // alert('not true')
          dispatch({type:'TOKTOK_MALL_CLOSE_MODAL'})
          return false
        }
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  // Function that will select our items from buy again function.
  const getPreItems = () => {
    if(route.params?.items && rawitems.length > 0) {
      setPreSelectedItems(route.params.items);
      const allitems = route.params.items.map(item => {
        const order = rawitems.find(raw => raw.productid === item);
        
        //Order is already in cart.
        if(!order) return;

        //Stocks and cont selling checker.
        if(order.product.contSellingIsset === 0 && order.product.noOfStocks <= 0) return;

        // //Checker if product is enabled.
        if(order.product.enabled !== 1) return;

        const orderIndex = rawitems.findIndex(raw => raw.productid === item);
        const data = {};

        data.checked = true;
        data.id = order.productid;
        data.productId = order.productid;
        data.shopId = order.shopid;     
        data.product = {
          ...order.product,
          Id: order.productid
        };
        data.amount = parseFloat(order.product.price * order.quantity);
        data.qty = order.quantity;
        data.index = orderIndex;

        return data;
      })

      setSelectedItemsArr(allitems)
      getSubTotal(allitems)
    }
  }

  const onChangeQuantity = (id, qty, shopId) => {
    let cartItems = ArrayCopy(myCartData);
    let cartItemIndex = cartItems.findIndex(i => i.shop.id === shopId);
    let shopData = cartItems.filter(item => item.shop.id === shopId)[0];
    let itemsData = shopData.data;
    let itemIndex = itemsData.findIndex(i => i.product.Id === id);
    let data = itemsData[itemIndex];

    data.quantity = qty;
    cartItems[cartItemIndex].data === data

    setMyCartData(cartItems);

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
      a = a + (temp[x]?.amount || 0)
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
    
    setapiloader(false)
    dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
      type: 'Success',
      message: 'Items has been removed from your cart.',
      onClose: () => {
        init()
      }
    }})
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
    setapiloader(false)
    if(req.responseData && req.responseData.success == 1){   
      console.log("Single Deletion Result: ", req.responseData)
      setTimeout(() => {
        // setSingleDeletemsgModalShown(true)
        dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
          type: 'Success',
          message: 'Item has been removed from\nyour cart.',
          onClose: () => {
            init()
          }
        }})
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
      CartContextData.setSelectedFrom('item')
    // }
  }

  const selectStoreItems = (raw, storeitems) => {
    
    let items = ArrayCopy(selectedItemsArr)
    storeitems.map((storeitem) => {
      let existing = items.findIndex((e) => e.id == storeitem.product.Id)
      if(existing == -1){
        if(storeitem.product?.enabled == 1){
          items.push({
            id: storeitem.product.Id,
            shopId: storeitem.shopid,
            product: storeitem.product,
            amount: parseFloat(storeitem.product.price * storeitem.quantity),
            qty: storeitem.quantity
          })
        }
      }
    })
    setSelectedItemsArr(items)
    // if(!willDelete){
    getSubTotal(items)
    // }
    CartContextData.setSelectedFrom('store')
  }

  const unSelectitem = (raw) => {
    
    let items = ArrayCopy(selectedItemsArr)
    items.map(item => console.log(item))
    let itemIndex = items.findIndex((e) => e.id === raw.productId)
    if(itemIndex > -1){
      items.splice(itemIndex, 1)
    }
    
    setSelectedItemsArr(items)
    // if(!willDelete){
      getSubTotal(items)
    // }
    CartContextData.setSelectedFrom('item')
  }

  const unSelectStoreItems = (raw, storeitems) => {
    
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
    CartContextData.setSelectedFrom('store')
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

          if(item.product?.enabled == 1){
            return {
              id: item.productid,
              shopId: item.shopid,
              product: item.product,
              amount: parseFloat(existingitem.product.price * existingitem.qty),
              qty: existingitem.qty
            }
          }else{
            return null
          }
          
        }else{
          //ITEM NOT EXIST, PUSH THE DATA FROM DATABASE
          
          if(item.product?.enabled == 1){
            return {
              id: item.productid,
              shopId: item.shopid,
              product: item.product,
              amount: parseFloat(item.product.price * item.quantity),
              qty: item.quantity
            }
          }else{
            return null
          }

        }
      }).filter(Boolean)
      // setItemsToCheckoutArr(allitems)
      // getSubTotal(allitems)
      setSelectedItemsArr(allitems.filter(item => (item.product.enabled === 1 && (item.product.contSellingIsset === 1 ? true : item.product.noOfStocks > 0))))
      // if(!willDelete){
        getSubTotal(allitems.filter(item => (item.product.enabled === 1 && (item.product.contSellingIsset === 1 ? true : item.product.noOfStocks > 0))))
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
    CartContextData.setSelectedFrom('item')
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
      // console.log(JSON.stringify(data))
      // return
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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  return (
    <>
      <View style={styles.container}>
        {/* {singleDeletemsgModalShown && (
          <CustomModal
            type="Success"
            setIsVisible={(val) => {
              setSingleDeletemsgModalShown(val);
            }}
            message={`Item has been removed from\nyour cart.`}
          />
        )}

        {messageModalShown && (
          <CustomModal
            type="Success"
            setIsVisible={(val) => {
              setMessageModalShown(val);
            }}
            message={`Items has been removed from your cart.`}
          />
        )} */}
        <Header label="Shopping Cart" />
        <View style={styles.margin1} />
        <View style={styles.subContainer}>
          {loading && <LoadingOverlay isVisible={loading} />}
          {apiloader && <LoadingOverlay isVisible={apiloader} />}

          {myCartData.length == 0 && !loading && !apiloader && <RenderEmpty />}

          {myCartData.length > 0 && (
            <>
              <View style={styles.cartContainer}>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    // isChecked={allSelected || itemsToCheckoutArr.length == totalitems}
                    isChecked={CartContextData.selectAll || selectedItemsArr.length == totalitems}
                    // isChecked = {CartContext.sele}
                    rightText="Select All"
                    rightTextStyle={styles.checkbox}
                    checkedCheckBoxColor="#F6841F"
                    uncheckedCheckBoxColor="#F6841F"
                    onClick={() => {
                      if (CartContextData.selectAll) {
                        //to false
                        unSelectAllitems();
                      } else {
                        //to true
                        selectAllItems();
                      }
                      CartContextData.setSelectAll(!CartContextData.selectAll)
                      CartContextData.setSelectedFrom('all')
                    }}
                  />
                </View>
                {willDelete && <TouchableOpacity
                  onPress={() => {
                    if (!willDelete == true) {
                      //Copy items selected by user from to checkout array
                      // setItemsToDelArr(itemsToCheckoutArr)
                      setItemsToCheckoutArr([]);
                      setItemsToDelArr([]);
                      // setSelectedItemsArr([])
                      // setSubTotal(0)
                    } else {
                      CartContextData.setSelectAll(false);
                      init();
                    }
                    setWillDelete(!willDelete);
                    CartContextData.setWillDelete(!willDelete);
                  }}
                  style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>}
              </View>
              <View style={styles.margin2} />

              <FlatList
                data={myCartData}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <RenderDetails
                        ref={swiperRefs}
                        references={swiperReferences}
                        item={item}
                        refreshing={loading}
                        willDelete={willDelete}
                        preSelectedItems={preSelectedItems}
                        selectedItemsArr={selectedItemsArr}
                        onPress={() => {
                          navigation.navigate('ToktokMallStore', {id: item.shop.id});
                        }}
                        onStoreSelect={(raw, items) => {
                          if (raw.checked) {
                            selectStoreItems(raw, items);
                          } else {
                            unSelectStoreItems(raw, items);
                          }
                        }}
                        onItemSelect={(raw) => {
                          if (raw.checked) {
                            selectItem(raw);
                          } else {
                            unSelectitem(raw);
                          }
                        }}
                        onItemLongPress={(raw) => {
                          // setWillDelete(raw.checked)
                          CartContextData.setWillDelete(true);
                          if (raw.checked) {
                            onItemLongPress(raw);
                          } else {
                            unSelectitem(raw);
                          }
                        }}
                        onItemDelete={(item) => {
                          dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
                            type: "Warning",
                            message: "Are you sure you want to delete\nthis item?",
                            actions: [
                              {
                                name: "Cancel"
                              },
                              {
                                name: "Confirm",
                                type: "fill",
                                onPress: () => {
                                  deleteSingleItem(item)
                                }
                              }
                            ]
                          }})
                        }}
                        onChangeQuantity={onChangeQuantity}
                      />
                      <View style={styles.margin3} />
                    </>
                  );
                }}
                keyExtractor={(item, index) => item + index}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => init()} />}
              />
            </>
          )}

          {myCartData.length > 0 && <View style={styles.margin4}></View>}

          {myCartData.length > 0 && willDelete && (
            <DeleteFooter
              onDelete={() => {
                dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
                  type: "Warning",
                  message: 'Are you sure you want to delete the selected item(s)?',
                  actions: [
                    {
                      name: "Cancel"
                    },
                    {
                      name: "Confirm",
                      type: "fill",
                      onPress: deleteMultipleItems
                    }
                  ]
                }})
              }}
              disabled={selectedItemsArr.length === 0}
              style={styles.deleteFooter(selectedItemsArr)}
            />
          )}

          {myCartData.length > 0 && !willDelete && (
            <CheckoutFooter
              onSubmit={async () => {
                setapiloader(true)
                await getVerifyCheckout({variables: {
                  input: {
                    items: selectedItemsArr
                  }
                }})
              }}
              subtotal={subTotal}
            />
          )}
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

export const ToktokMallMyCartScreen = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  margin1: {
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  subContainer: {
    flex: 1
  },
  cartContainer: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  checkboxContainer: {
    flex: 6, 
    justifyContent: 'center'
  },
  checkbox: {
    fontSize: 14, 
    fontWeight: '500', 
    fontFamily:FONT.BOLD
  },
  cancelButton: {
    flex: 1, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  cancelText: {
    fontSize: 14, 
    color: '#F6841F'
  },
  margin2: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  margin3: {
    height: 6, 
    backgroundColor: '#F7F7FA'
  },
  margin4: {
    height: 80
  },
  deleteFooter: (selectedItemsArr) => {
    return {
      backgroundColor: selectedItemsArr.length === 0 ? '#D7D7D7' : '#F6841F'
    }
  }
});
