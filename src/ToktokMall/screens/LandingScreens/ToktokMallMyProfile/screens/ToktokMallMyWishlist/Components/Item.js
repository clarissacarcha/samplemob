import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {coppermask} from '../../../../../../assets';
import CheckBox from 'react-native-check-box';
import {FONT} from '../../../../../../../res/variables';
import { useNavigation } from '@react-navigation/native';

export const Store = ({data}) => {

  const getShopLogo = (raw) => {
    if(typeof raw == "string") return {uri: raw}
    else return require('../../../../../../assets/icons/store.png')
  }

  return (
    <>
      <View style={styles.shopContainer}>
        <View style={styles.flex0}>
          <Image
            source={getShopLogo(data.profileImages.logo)}
            style={styles.shopLogoContainer}
          />
        </View>
        <View style={styles.shopNameContainer}>
          <Text style={styles.shopNameText}>{data.shopname}</Text>
        </View>
      </View>
      <View style={styles.margin1} />
    </>
  );
};

export const Item = ({rawdata, onHold, onChecked, willDelete}) => {

  const data = rawdata?.product

  const [selected, setSelected] = useState(false);
  const {navigate} = useNavigation()

  const RenderCheckBox = () => {
    return (
      <>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
            uncheckedCheckBoxColor="#F6841F"
            onClick={() => {
              onChecked(data);
              setSelected(!selected);
            }}
          />
        </View>
      </>
    );
  };

  const RenderInStock = ({images}) => {
    return (
      <>
        <View style={styles.stockContainer}>
          <Image
            source={images && images.length > 0 ? {uri: images[0].filename} : coppermask}
            style={styles.stockImage}
          />
        </View>
      </>
    );
  };

  const RenderOutOfStock = ({images}) => {
    return (
      <>
        <ImageBackground
          source={images && images.length > 0 ? {uri: images[0].filename} : coppermask}
          style={styles.outofStockImageBG}
          imageStyle={{resizeMode: 'center'}}>
          <View
            style={styles.outofStockContainer}>
            <Text style={styles.outofStockText}>OUT OF STOCK</Text>
          </View>
        </ImageBackground>
      </>
    );
  };
  return (
    <>
      <TouchableOpacity onPress={() => navigate("ToktokMallProductDetails", data)} onLongPress={onHold} style={styles.container}>
        {willDelete && <RenderCheckBox />}
        {data.noOfStocks && data.noOfStocks > 0 ? <RenderInStock images={data.images} /> : <RenderOutOfStock images={data.images} />}
        <View style={styles.flex8}>
          <View style={styles.subContainer}>
            <View>
              <Text style={styles.itemNameText} numberOfLines={2} ellipsizeMode="tail">{data.itemname}</Text>
            </View>
            <View style={styles.priceContainer}>
              <View style={styles.flex0}>
                <Text style={styles.priceText}>&#8369;{parseFloat(data.price).toFixed(2)}</Text>
              </View>
              <View style={styles.comparedAtPriceContainer}>
                {data.comparedAtPrice && <Text style={styles.comparedAtPriceText}>
                  &#8369;{parseFloat(data.comparedAtPrice).toFixed(2)}
                </Text>}
              </View>
            </View>
            <View style={styles.variationContainer}>
              <View style={styles.flex2}>
                {data.variationSummary && <Text style={styles.variationText}>Variation: {data.variation}</Text>}
              </View>
              <View style={styles.addToCartContainer}>
                <View style={styles.addToCartSubContainer}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </View>
              </View>
              <View style={styles.flex02}></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.margin2} />
    </>
  );
};

const styles = StyleSheet.create({
  shopContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    paddingVertical: 20
  },
  flex0: {
    flex: 0
  },
  shopLogoContainer: {
    width: 24, 
    height: 24, 
    resizeMode: 'stretch'
  },
  shopNameContainer: {
    flex: 1, 
    paddingHorizontal: 7.5, 
    justifyContent: 'center'
  },
  shopNameText: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  margin1: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  checkBoxContainer: {
    flex: 0, 
    justifyContent: 'center'
  },
  stockContainer: {
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 5, 
    borderRadius: 5
  },
  stockImage: {
    width: 55, 
    height: 80, 
    resizeMode: 'stretch', 
    borderRadius: 5
  },
  outofStockImageBG: {
    flex: 2.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingRight: 8, 
    borderRadius: 5
  },
  outofStockContainer: {
    flex: 0,
    position: 'absolute',
    paddingVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outofStockText: {
    fontSize: 10, 
    color: '#fff', 
    fontFamily: FONT.BOLD
  },
  container: {
    flexDirection: 'row', 
    paddingVertical: 10, 
    paddingHorizontal: 15
  },
  flex8: {
    flex: 8
  },
  subContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  itemNameText: {
    fontSize: 13, 
    fontWeight: '100'
  },
  priceContainer: {
    flexDirection: 'row'
  },
  priceText: {
    fontSize: 13, 
    color: '#F6841F'
  },
  comparedAtPriceContainer: {
    flex: 0, 
    paddingHorizontal: 10
  },
  comparedAtPriceText: {
    color: '#9E9E9E', 
    textDecorationLine: 'line-through', 
    fontSize: 11
  },
  variationContainer: {
    flexDirection: 'row', 
    paddingVertical: 5
  },
  flex2: {
    flex: 2
  },
  variationText: {
    color: '#9E9E9E', 
    fontSize: 13
  },
  addToCartContainer: {
    flex: 1, 
    flexDirection: 'row-reverse'
  },
  addToCartSubContainer: {
    paddingVertical: 2, 
    paddingHorizontal: 8, 
    backgroundColor: '#F6841F', 
    borderRadius: 5
  },
  addToCartText: {
    color: '#fff', 
    fontSize: 11
  },
  flex02: {
    flex: 0.2
  },
  margin2: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  }
})
