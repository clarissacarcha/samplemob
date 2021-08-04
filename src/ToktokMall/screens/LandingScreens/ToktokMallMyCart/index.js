import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';

import {MessageModal} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails} from './components';
import {ASGetCart, ASClearCart} from '../../../helpers';

const testdata = [
  {
    store: 'Face Mask PH',
    cart: [
      {
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 100,
        variation: 'Bronze',
        qty: 1,
      },
      {
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 150,
        variation: 'White',
        qty: 1,
      },
    ],
  },
  {
    store: 'The Apparel',
    cart: [
      {
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 50,
        variation: 'White, L',
        qty: 2,
      },
    ],
  },
  {
    store: 'The Apparel',
    cart: [
      {
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 350,
        variation: 'White, L',
        qty: 2,
      },
    ],
  },
];

export const ToktokMallMyCart = ({navigation}) => {

  const [allSelected, setAllSelected] = useState(true);
  const [willDelete, setWillDelete] = useState(false);
  const [messageModalShown, setMessageModalShown] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [itemsToDelete, setItemsToDelete] = useState(0);
  const [itemsToDeleteArray, setItemsToDeleteArray] = useState([])
  const [storeItemsToDeleteArray, setStoreItemsToDeleteArray] = useState([])

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const getSubTotal = async () => {
    let a = 0;
    for (var x = 0; x < cartData.length; x++) {
      for (var y = 0; y < cartData[x].cart.length; y++) {
        let item = cartData[x].cart[y];
        a += parseFloat(item.price) * item.quantity;
        console.log(a);
      }
    }
    setSubTotal(a);
  };

  const init = async () => {
    await ASGetCart("bryan", (response) => {
      console.log("Cart Content", response)
      setCartData(response)
    })
    // await ASClearCart("bryan")
  }

  useEffect(() => {
    init();
    getSubTotal();
  }, []);

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
                  }else{
                    //to true
                    getSubTotal()
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
            data={cartData}
            renderItem={({item}) => {
              return (
                <>
                  <RenderDetails 
                    item={item}
                    allSelected={allSelected}
                    onPress={() => {
                      navigation.navigate("ToktokMallStore")
                    }}
                    onStoreSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.total
                        let temp = itemsToDeleteArray
                        let temp2 = []
                        raw.items.map((a, i) => {
                          temp.push(a.Id)       
                        })
                        setItemsToDeleteArray(temp)
                      }else{
                        res = subTotal - raw.total
                        let temp = itemsToDeleteArray
                        raw.items.map((a, i) => {
                          let index = temp.indexOf(a.Id)
                          temp.splice(index, 1)
                        })
                        setItemsToDeleteArray(temp)
                      }
                      setSubTotal(res)
                    }}
                    onItemSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.amount 
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel + 1)
                        let temp = itemsToDeleteArray
                        let temp2 = []
                        temp.map((a, i) => {
                          if(a != raw.item.Id){
                            temp2.push(a)
                          }
                        })
                        temp2.push(raw.item.Id)
                        setItemsToDeleteArray(temp2)
                      }else{
                        res = subTotal - raw.amount
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel - 1)
                        let temp = itemsToDeleteArray
                        let temp2 = []
                        temp.map((a, i) => {
                          if(a != raw.item.Id){
                            temp2.push(a)
                          }
                        })
                        setItemsToDeleteArray(temp2)
                      }
                      setSubTotal(res)
                    }} 
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
          <DeleteFooter 
            onDelete={() => {
            // setMessageModalShown(true)
              console.log("To Delete:")
              console.log(itemsToDeleteArray) 
              console.log("Cart Data:")
              console.log(cartData)

              let temp = []
              
              cartData.map((a, i) => {
                let _cart = []
                a.cart.map((c, y) => {
                  let found = false
                  for(var x=0;x<itemsToDeleteArray.length;x++){
                    if(itemsToDeleteArray[x] != c.Id){
                      found = true                  
                    }else if(itemsToDeleteArray[x] == c.Id){
                      found = false
                    }
                  }
                  if(found) _cart.push(c)
                })
                a.cart = _cart
                temp.push(a)
              })

              console.log("Result", temp)
            
            }} 
          /> : 
          <CheckoutFooter 
            onSubmit={() => {
              navigation.navigate("ToktokMallCheckout", {vouchers: []})
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
