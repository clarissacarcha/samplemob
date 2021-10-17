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
import {MergeStoreProducts} from '../../../helpers';
import { create } from 'lodash';
import {useSelector} from 'react-redux';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_MY_CART } from '../../../../graphql/toktokmall/model';
import AsyncStorage from '@react-native-community/async-storage';

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

  useEffect(()=> {
    if(itemsToCheckoutArr && itemsToCheckoutArr.length !== 0){
      getSubTotal(itemsToCheckoutArr)
    }else if(itemsToCheckoutArr && itemsToCheckoutArr.length === 0){
      setSubTotal(0)
    }
  }, [itemsToCheckoutArr])

  const init = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        setUser(data)
        setMyCartData([])
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

  useEffect(() => {
    init()
  }, [])

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

  const deleteMultipleItems = async () => {

    // let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    // if(allSelected){
    //   createMyCartSession("set", [])
    // }else{
    //   createMyCartSession("DeleteMultiple", itemsToDelArr)
    //   itemsToDelArr.map((item, i) => {
    //     //Check if item already exist on current items
    //     let index = currentItems.findIndex((a) => a.item_id == item.item_id)
    //     currentItems.splice(index, 1)
    //   })
    //   setItemsToCheckoutArr(currentItems)
    // }
    // getSubTotal()

    setapiloader(true)
    console.log(itemsToDelArr)

    let process = await Promise.all(itemsToDelArr.map(async (item, index) => {
     
      let variables = {
        userid: user.userId,
        shopid: item.shop.id,
        branchid: 0,
        productid: [item.product.Id]
      }
      const req = await ApiCall("remove_cart", variables, true)
      
      if(req.responseData && req.responseData.success == 1){   
        console.log("Multiple Deletion Result #: " + index, req.responseData)
        return true
      }else{
        return false
      }

    }));

    setapiloader(false)
    console.log("Process result", process)

  }

  const deleteSingleItem = async (item) => {

    // createMyCartSession("DeleteSingle", {item_id: id.item_id})

    // let currentItems = JSON.parse(JSON.stringify(itemsToCheckoutArr))
    // let willDeleteItems = JSON.parse(JSON.stringify(itemsToDelArr))

    // let index = willDeleteItems.findIndex((a) => a.item_id === id.item_id)
    // willDeleteItems.splice(index, 1)
    // setItemsToDelArr(willDeleteItems)

    // let indexC = currentItems.findIndex((a) => a.item_id === id.item_id)
    // currentItems.splice(indexC, 1)
    // setItemsToCheckoutArr(currentItems)
    // setSingleDeletemsgModalShown(true)
    // getSubTotal()

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
      setSingleDeletemsgModalShown(true)
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }

  }

  const deleteItems = async (type, singleItem) => {
    
    let variables = {
      userid: user.id,
      shopid: singleItem.shop.id,
      branchid: 0,
      productid: [singleItem.product.Id]
    }

    const req = await ApiCall("remove_cart", variables, false)

    if(req.responseData && req.responseData.success == 1){
      if(type == 'single'){
        //single item delete
        // deleteSingleItem(singleItem)

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
          let exist = willDeleteItems.findIndex((a) => a.Id == item.Id)
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
          let exist = currentItems.findIndex((a) => a.Id == item.Id)
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

          {loading && <LoadingOverlay isVisible={loading} />}
          {apiloader && <LoadingOverlay isVisible={apiloader} />}

          {myCartData.length == 0 && !loading && !apiloader && <RenderEmpty />}

          {myCartData.length > 0 && 
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
                    setItemsToCheckoutArr([])
                  }else{
                    //to true
                    setItemsToCheckoutArr(myCartData)
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
            data={myCartData}
            renderItem={({item, index}) => {
              return (
                <>
                  <RenderDetails 
                    item={item}
                    allSelected={allSelected}
                    refreshing={loading}
                    onPress={() => {
                      navigation.navigate("ToktokMallStore", {id: item.shop.id})
                    }}
                    onStoreSelect={(raw) => {
                      
                    }}
                    onItemSelect={(raw) => {
                      
                    }} 
                    onItemLongPress={(raw) => {
                      setWillDelete(true)
                    }}
                    onItemDelete={(item) => {
                      deleteSingleItem(item)
                    }}
                    onChangeQuantity={(qty, id) => {
                      
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
            setIsVisible={(val) => setMessageModalShown(val)}  
            message={`${itemsToDelArr.length > 1 || willDelete ? "Items" : "Item"} has been removed from your cart.`}
          />}

          {singleDeletemsgModalShown && 
          <MessageModal 
            type="Success"
            isVisible={singleDeletemsgModalShown}
            setIsVisible={(val) => {
              setSingleDeletemsgModalShown(val)
              init()
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
