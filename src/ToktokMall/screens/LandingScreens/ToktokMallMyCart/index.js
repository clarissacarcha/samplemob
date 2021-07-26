import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';

import {MessageModal} from '../../../Components';
import {DeleteFooter, CheckoutFooter, Item, Store, RenderDetails} from './components';

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
  const [itemsToDelete, setItemsToDelete] = useState(0)

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const getSubTotal = async () => {
    let a = 0;
    for (var x = 0; x < testdata.length; x++) {
      for (var y = 0; y < testdata[x].cart.length; y++) {
        let item = testdata[x].cart[y];
        a += item.price * item.qty;
        console.log(a);
      }
    }
    setSubTotal(a);
  };

  useEffect(() => {
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
            data={testdata}
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
                      }else{
                        res = subTotal - raw.total
                      }
                      setSubTotal(res)
                    }}
                    onItemSelect={(raw) => {
                      let res = 0
                      if(raw.checked){
                        res = subTotal + raw.amount 
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel + 1)
                      }else{
                        res = subTotal - raw.amount
                        let _itemsToDel = itemsToDelete
                        setItemsToDelete(_itemsToDel - 1)
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
          <DeleteFooter onDelete={() => {
            setMessageModalShown(true)
          }} /> : 
          <CheckoutFooter 
            onSubmit={() => {
              navigation.navigate("ToktokMallCheckout")
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
