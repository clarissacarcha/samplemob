import React, {useState} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';

import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'
import { connect } from 'react-redux';

import { RenderStars, RenderVariations } from './subComponents';
import ContentLoader from 'react-native-easy-content-loader';

const Component = ({data, onOpenVariations, animatedValue, shop, loading, reduxActions: {
  updateMyFavorites
}}) => {

  const [favorite, setFavorite] = useState(false)
  const opacity = animatedValue.interpolate({
    inputRange: [200, 250],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const HandleShare = () => {
    let options = {
      message: data?.itemname,
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
      Toast.show('Added to Favorites')
      updateMyFavorites('add', {shop, item: data })
      setFavorite(true)
    }else{
      Toast.show('Removed to Favorites')
      updateMyFavorites('delete', {shop, item: data })
      setFavorite(false)
    }
    if(favorite){
      Toast.show('Removed to Favorites')
      setFavorite(false)
    }
  }

  

	return (
		<>
			<View style={{paddingVertical: 8, paddingHorizontal: 16}}>
        <ContentLoader 
          loading = {loading} 
          avatar = {false}
          pRows = {2}
          titleStyles = {{height: 22, left: -10, }}
          paragraphStyles = {{height: 13, left: -10 }}
          pWidth = {'45%'}
        >
          <Animated.Text style={[{fontSize: 22, fontWeight: '500', fontFamily: FONT.BOLD}, {opacity: opacity}]}>{data.itemname}</Animated.Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1.5}}>
              {data.price ? <Text style={{color: "#F6841F", fontSize: 20}}><Price amount={data.price} /></Text> : null}
            </View>
            <View style={{flex: 3, justifyContent: 'center'}}>
              {data.compareAtPrice ? <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 14}}><Price amount={data.compareAtPrice} /></Text> : null}
            </View>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 8}}>
            <View style={{flex: 3, flexDirection: 'row', justifyContent: 'space-between', marginTop: 1}}>
              <RenderStars value={data.rating} />
            </View>
            <View style={{flex: 5, flexDirection: 'row', paddingHorizontal: 12}}>
              <View>
                <Text>{data.rating || 0}/5</Text>
              </View>
              <View style={{paddingHorizontal: 2}} >
                <Text style={{color: "#9E9E9E"}}> | </Text>
              </View>
              <View>
                <Text>{data.soldCount || 0} sold</Text>
              </View>
            </View>
            <View style={{flex: 1.8, flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => HandleToggleFavorites()}>
                {favorite ? <CustomIcon.EIcon name="heart" size={22} color="#F6841F" /> : <CustomIcon.EIcon name="heart-outlined" size={22} color="#9E9E9E" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => HandleShare()}>
                <CustomIcon.FeIcon name="share" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View>
          </View>
          
        </ContentLoader>
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      <RenderVariations 
        data={data?.variantSummary || []} 
        navigate={onOpenVariations} 
      />
      
		</>
	)
}

const mapStateToProps = (state) => ({
  reduxStates: {
    myFavorities: state.toktokMall.myFavorities,
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
