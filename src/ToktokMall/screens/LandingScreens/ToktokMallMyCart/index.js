import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, StatusBar, Image, TouchableOpacity, FlatList} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import {AlertOverlay} from '../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import CheckBox from 'react-native-check-box';

import {DeleteFooter, CheckoutFooter, Item, Store} from './components';

const testdata = [
  {
    store: 'Face Mask PH',
    cart: [
      {
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 190,
        variation: 'Bronze',
        qty: 1,
      },
      {
        label: 'Improved Copper Mask 2.0 White or Bronze',
        originalPrice: 380,
        price: 190,
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
        price: 190,
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
        price: 190,
        variation: 'White, L',
        qty: 2,
      },
    ],
  },
];

export const ToktokMallMyCart = ({navigation}) => {
  const [allSelected, setAllSelected] = useState(true);
  const [willDelete, setWillDelete] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  navigation.setOptions({
    headerLeft: () => <HeaderBack hidden={true} />,
    headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const init = async () => {
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
    init();
  }, []);

  return (
    <>
      <View style={styles.container}>
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
                  <Store
                    data={item}
                    onSelect={() => {
                      let cart = item.cart;
                      console.log(cart);
                    }}
                  />
                  {item.cart.map((data, i) => (
                    <Item
                      data={data}
                      onSelect={() => {
                        let a = 0;
                        for (var x = 0; x < testdata.length; x++) {
                          for (var y = 0; y < testdata[x].cart.length; y++) {
                            let item = testdata[x].cart[y];
                            if (y == i) continue;
                            else a += item.price * item.qty;
                            console.log(a);
                          }
                        }
                        setSubTotal(a);
                        console.log(data);
                      }}
                    />
                  ))}
                  <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
                </>
              );
            }}
          />

          <View style={{height: 80}}></View>

          {willDelete ? 
          <DeleteFooter /> : 
          <CheckoutFooter 
            onSubmit={() => {
              navigation.navigate("ToktokMallCheckout")
            }} 
            subtotal={subTotal} 
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
