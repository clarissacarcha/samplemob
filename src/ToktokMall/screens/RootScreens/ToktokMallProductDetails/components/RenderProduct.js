import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity } from 'react-native';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';

import { Header, RefComDiscountRate } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'
import { connect } from 'react-redux';

import { RenderStars, RenderVariations } from './subComponents';
import ContentLoader from 'react-native-easy-content-loader';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../../helpers";
import { GET_MY_FAVORITES } from '../../../../../graphql/toktokmall/model';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const Component = ({
  data, 
  onOpenVariations, 
  animatedValue, 
  shop, 
  loading, 
  user, 
  reduxActions: {
    updateMyFavorites
  }, 
  reduxStates: {
    myFavorites
  }
}) => {

  const [favorite, setFavorite] = useState(false)
  const [favorites, setFavorites] = useState([])
  const opacity = animatedValue.interpolate({
    inputRange: [200, 250],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const [getMyFavorites, {error}] = useLazyQuery(GET_MY_FAVORITES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log(response)
      if(response.getMyFavorites){
        setFavorites(response.getMyFavorites)
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
        getMyFavorites({
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

  useEffect(() => {
   if(favorites && data?.Id){
    favorites.map(({shop: {id}, items}) => {
       if(shop.id === id){
         let temp = false
         items.map(item => {
           if(item.product.Id === data.Id){
             temp = true
           }
         })
         setFavorite(temp)
       }
     })
   }
 },[favorites, shop, data])

 const addToFavorites = async () => {

    let variables = {
      shopid: shop.id,
      branchid: '',
      userid: user.userId,
      productid: data.Id
    }

    console.log(variables)
    const req = await ApiCall("set_favorite_product", variables, true)

    if(req.responseData && req.responseData.success == 1){
      Toast.show('Added to Favorites')
      updateMyFavorites('add', {shop, item: data })
      setFavorite(true)
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }

  }

  const removeFromFavorites = async () => {
    let variables = {
      shopid: shop.id,
      branchid: '',
      userid: user.userId,
      productid: data.Id
    }
    // data.pin = value
    const req = await ApiCall("remove_favorite_product", variables, true)

    if(req.responseData && req.responseData.success == 1){
      Toast.show('Removed to Favorites')
      updateMyFavorites('delete', {shop, item: data })
      setFavorite(false)
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  const HandleShare = async () => {
    let options = {
      message: data?.itemname,
      // url: `http://ec2-18-178-242-131.ap-northeast-1.compute.amazonaws.com/products/${data?.Id}`,
      url: `https://toktokmall.ph/products/${data?.Id}`
    }
    Share.open(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
  }

  const HandleToggleFavorites = () => {
    if(!favorite){
      addToFavorites()
    }else{
      removeFromFavorites()
    }
    if(favorite){
      removeFromFavorites()
    }
    // console.log(shop)
  }

	return (
		<>
			<View style={styles.container}>
        {/* <ContentLoader 
          loading = {loading} 
          avatar = {false}
          pRows = {2}
          titleStyles = {{height: 22, left: -10, }}
          paragraphStyles = {{height: 13, left: -10 }}
          pWidth = {'45%'}
        ></ContentLoader> */}
          <Animated.View style={{flexDirection: 'row', opacity: opacity}}>
            <View style={{flex: 9}}>
              <Text 
                style={styles.itemTitle} 
                numberOfLines={2} 
                ellipsizeMode="tail"
              >
                {data?.itemname?.trim()}
              </Text>
            </View>         
            <View style={{flex: 0}}>
              {data?.discountRate != "" && 
              <View style={styles.discountRateContainer}>
                <Text style={styles.discountRateText}>{data?.discountRate}</Text>
              </View>}
            </View> 
          </Animated.View>
          <View style={styles.itemPriceContainer}>

            { data.price ? 
                <Text style={styles.itemPriceText}>
                  <Price amount={data.price} />
                </Text> : null}

            { data.compareAtPrice && data.compareAtPrice != "0.00" ? 
                <Text style={styles.compareAtPriceText}>
                  <Price amount={data.compareAtPrice} />
                </Text> : null}

              {/* <Text style={{marginLeft: 10}}>{data.soldCount || 0} sold</Text>  */}
            {/* <View style={{flex: 1.8, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={{marginRight: 10}} onPress={() => HandleToggleFavorites()}>
                {favorite ? <CustomIcon.EIcon name="heart" size={22} color="#F6841F" /> : <CustomIcon.EIcon name="heart-outlined" size={22} color="#9E9E9E" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => HandleShare()}>
                <CustomIcon.FeIcon name="share" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View> */}

            <View style={styles.refComDiscountRateText}>
              {data.refComDiscountRate && data.refComDiscountRate != "" ? 
                <RefComDiscountRate value={data.refComDiscountRate} w='40%' /> : null}
            </View>

          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{flex: 1}}>{data.soldCount || 0} sold</Text>
            <View style={styles.share}>
              {/* <TouchableOpacity style={{marginRight: 10}} onPress={() => HandleToggleFavorites()}>
                {favorite ? <CustomIcon.EIcon name="heart" size={22} color="#F6841F" /> : <CustomIcon.EIcon name="heart-outlined" size={22} color="#9E9E9E" />}
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => HandleShare()}>
                <CustomIcon.FeIcon name="share" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View>
          </View>
        
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      <RenderVariations 
        data={data?.variations || []} 
        navigate={onOpenVariations} 
      />
      
		</>
	)
}

const mapStateToProps = (state) => ({
  reduxStates: {
    myFavorites: state.toktokMall.myFavorites,
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateMyFavorites: (action, payload) => {
      dispatch({type: 'TOKTOK_MY_FAVORITES', action, payload});
    },
  },
});

export const RenderProduct = connect(mapStateToProps, mapDispatchToProps)(Component);


const styles = StyleSheet.create({
  container: {
    marginTop: 35, 
    paddingVertical: 8, 
    paddingHorizontal: 16
  },
  itemTitle: {
    fontSize: 22, 
    fontWeight: '500', 
    fontFamily: FONT.BOLD
  },
  discountRateContainer: {
    position:'absolute', 
    zIndex: 1, 
    right: 0, 
    top: -16, 
    backgroundColor: '#F6841F', 
    borderBottomLeftRadius: 30
  },
  discountRateText: {
    fontSize: 11, 
    paddingHorizontal: 8,
    paddingLeft: 16, 
    paddingTop: 1, 
    paddingBottom: 3, 
    color: "#fff", 
    fontFamily: FONT.BOLD
  },
  itemPriceContainer:{
    flexDirection: 'row', 
    alignItems: "center"
  },
  itemPriceText: {
    color: "#F6841F", 
    fontSize: 20
  },
  compareAtPriceText: {
    color: "#9E9E9E", 
    textDecorationLine: 'line-through', 
    fontSize: 14, 
    marginLeft: 10
  },
  refComDiscountRateText: {
    flex: 1.8, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  share: {
    flex: 1.8, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
})