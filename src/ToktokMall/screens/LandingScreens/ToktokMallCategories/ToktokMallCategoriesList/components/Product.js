import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import { FONT } from '../../../../../../res/variables';
import CustomIcon from '../../../../../Components/Icons';
import { useNavigation } from '@react-navigation/native';
import {placeholder} from '../../../../../assets';
import { Price } from '../../../../../helpers';

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

const RenderItem = ({navigation, item}) => {

  const getImageSource = (data) => {
    if(data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={styles.renderItemContainer}>
                  
        <View style={styles.renderItemSubContainer}>
          <Image 
            source={getImageSource(item?.images || [])} 
            style={styles.renderItemImage} 
          />

          <TouchableOpacity onPress={() => navigation.navigate("ToktokMallProductDetails", item)}>
            <Text style={styles.renderItemNameText}>{item?.itemname || ""}</Text>
          </TouchableOpacity>
          <Text style={styles.renderItemPriceText}>
            <Price amount={item?.price}/>
          </Text>    
          <View style={styles.renderItemNoStockContainer}>
            {/* <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item?.rating} />
            </View> */}
            <View style={styles.renderItemNoStockTextContainer}>
              <Text style={styles.renderItemNoStockText}>({item?.noOfStocks || 0})</Text>
            </View>
            <View style={styles.renderItemSoldContainer}>
              <Text style={styles.renderItemSoldText}>{item?.soldCount || 0} sold</Text>
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
                return <RenderItem navigation={navigation} item={item}  />
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
  container: {
    flex: 0, 
    paddingVertical: 10
  },
  heading: {
    paddingHorizontal: 15, 
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  h1: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  link: {
    fontSize: 12, 
    color: "#F6841F"
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    alignSelf: 'center', 
    borderRadius: 8
  },
  label: {
    fontSize: 11, 
    alignSelf: 'center'
  },
  separator: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  renderItemContainer: {
    flex: 2, 
    backgroundColor: '#fff', 
    margin: 5
  },
  renderItemSubContainer: {
    padding: 5
  },
  renderItemImage: {
    resizeMode: 'cover', 
    width: '100%', 
    height: 120, 
    borderRadius: 5
  },
  renderItemNameText: {
    fontSize: 13, 
    fontWeight: '500', 
    paddingVertical: 5
  },
  renderItemPriceText: {
    fontSize: 13, 
    color: "#F6841F"
  },
  renderItemNoStockContainer: {
    flexDirection: 'row'
  },
  renderItemNoStockTextContainer: {
    flex: 9
  },
  renderItemNoStockText: {
    color: "#9E9E9E", 
    fontSize: 10
  },
  renderItemSoldContainer: {
    flex: 3
  },
  renderItemSoldText: {
    fontSize: 10
  }
})