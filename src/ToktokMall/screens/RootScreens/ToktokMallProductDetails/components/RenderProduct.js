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

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
      <CustomIcon.FoIcon name="star" size={14} color={value >= 1 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 2 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 3 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 4 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 5 ? orange : gray} />
    </>
  )
}

const RenderVariations = ({data, navigate}) => {

  const [activeIndex, setActiveIndex] = useState(-1)

  if(data.length == 0){
    return null
  }else{
    return (
      <>
        <View style={{paddingVertical: 8, paddingHorizontal: 8}}>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <View style={{flex: 2, flexDirection: 'row', paddingHorizontal: 8}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Select Variation</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 14, color: "#9E9E9E"}}></Text>
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row-reverse'}}>
              <TouchableOpacity onPress={navigate} style={{flex: 0}}>
                <CustomIcon.MCIcon name="chevron-right" size={24} color="#F6841F" />
              </TouchableOpacity>
            </View>
          </View>
  
          <View style={{paddingHorizontal: 8, flexDirection: 'row', paddingVertical: 8}}>        
            {/* <Image source={coppermask} style={{width: 55, height: 65, resizeMode: 'center', borderColor: "#9E9E9E", borderWidth: 1, marginRight: 4}} /> */}
            {/* <Image source={coppermask} style={{width: 55, height: 65, resizeMode: 'center', borderColor: "#9E9E9E", borderWidth: 1, marginRight: 4}} /> */}
            {data.map((item, i) => {
              
              let variantslist = item?.variantList || ""
              const variants = variantslist.split(",")

              if(variants.length == 0 || item.variantType == "") return null

              return (
                <>
                  <View>
                    <View style={{paddingVertical: 4}}>
                      <Text style={{fontSize: 13}}>{item?.variantType || ''}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      {variants.map((variant, y) => {
                        return (
                          <>
                            <TouchableOpacity onPress={() => setActiveIndex(y)} style={{paddingVertical: 4, paddingHorizontal: 15, borderRadius: 5, borderWidth: 0.5, borderColor: activeIndex == y ? "#F6841F" : "lightgray"}}>
                              <Text style={{fontSize: 11, color: "#9E9E9E"}}>{variant}</Text>
                            </TouchableOpacity>
                            <View style={{width: 5}} />
                          </>
                        )
                      })}
                    </View>
                  </View>
                </>
              )
            })}
          </View>
  
        </View>
        <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
      </>
    )
  }
}

export const RenderProduct = ({data, onOpenVariations, animatedValue}) => {

  
  const [favorite, setFavorite] = useState(false)
  const opacity = animatedValue.interpolate({
    inputRange: [200, 250],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

	return (
		<>
			<View style={{paddingVertical: 8, paddingHorizontal: 16}}>
        <Animated.Text style={[{fontSize: 22, fontWeight: '500', fontFamily: FONT.BOLD}, {opacity: opacity}]}>{data.itemname}</Animated.Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1.5}}>
            <Text style={{color: "#F6841F", fontSize: 20}}><Price amount={data.price} /></Text>
          </View>
          <View style={{flex: 3, justifyContent: 'center'}}>
            {data.comparedAtPrice ? <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 14}}><Price amount={data.comparedAtPrice} /></Text> : null}
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
            <TouchableOpacity onPress={() => {
              if(!favorite){
                Toast.show('Added to Favorites')
                setFavorite(true)
              }else{
                Toast.show('Removed to Favorites')
                setFavorite(false)
              }
              if(favorite){
                Toast.show('Removed to Favorites')
                setFavorite(false)
              }
            }}>
              {favorite ? <CustomIcon.EIcon name="heart" size={22} color="#F6841F" /> : <CustomIcon.EIcon name="heart-outlined" size={22} color="#9E9E9E" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {

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
            }}>
              <CustomIcon.FeIcon name="share" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      <RenderVariations data={data?.variantSummary || []} navigate={onOpenVariations} />

		</>
	)
}