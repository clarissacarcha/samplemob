import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../Components/Icons';
import {placeholder} from '../../../../assets';
import { useNavigation } from '@react-navigation/core';

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
      <CustomIcon.FoIcon name="star" size={12} color={value >= 1 ? orange : gray}  />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 2 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 3 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 4 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 5 ? orange : gray} />
    </>
  )
}

const RenderItem = ({item, navigation}) => {

  const getImageSource = (data) => {
    if(data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}>
                  
        <View style={{padding: 5}}>
          <Image 
            source={getImageSource(item?.images || [])} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <TouchableOpacity onPress={() => navigation.navigate("ToktokMallProductDetails", item)}>
            <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}}>{item?.itemname || ""}</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 13, color: "#F6841F"}}>&#8369;{parseFloat(item?.price).toFixed(2)}</Text>    
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item?.rating} />
            </View>
            <View style={{flex: 2}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>({item?.noOfStocks || 0})</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={{fontSize: 10}}>{item?.soldCount || 0} sold</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

export const Product = ({data}) => {

  const navigation = useNavigation()

    return (
      <>
        <View style={styles.container}>
            
            <FlatList
              data={data}
              numColumns={2}
              style={{paddingHorizontal: 5}}
              renderItem={({item}) => {
                return <RenderItem item={item} navigation={navigation} />
              }}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
            />
            
          </View>
          <View style={{height: 15}}></View>
          <View style={styles.separator} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 0, paddingVertical: 10},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})