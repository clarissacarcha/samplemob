import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FONT } from '../../../../../res/variables';
import { placeholder } from '../../../../assets';
import { PromotionBanner, RefComDiscountRate } from '../../../../Components';
import { Price } from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';

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


export const Item = ({ navigation, item }) => {
  const getImageSource = (data) => {
    if(data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("ToktokMallProductDetails", item)} 
      >

        {item?.discountRate != "" && 
          <View style={styles.discountView}>
            <Text style={styles.discountText}>
              {item?.discountRate}
            </Text>
          </View>}

        {item.promotions && item.promotions != null &&
          <PromotionBanner 
            label={item.promotions.name}
            content={item.promotions.duration}
          />}

        <Image 
          source={getImageSource(item?.images || [])} 
          style={styles.images} 
        />

        <View>
          <Text 
            style={styles.name} 
            numberOfLines={2} >
              {item?.itemname || ""}
            </Text>
        </View>
          
        {/* <View style={{flexDirection: 'row'}}>
          <View style={{flex: 7, flexDirection: 'row'}}>
            <RenderStars value={item?.rating} />
          </View>
          <View style={{flex: 9}}>
            <Text style={{color: "#9E9E9E", fontSize: 10}}>({item?.noOfStocks || 0})</Text>
          </View>
        </View> */}

        <View style={{flexDirection: 'row'}}>

          <View style={{flex: 2.3}}>
            <Text style={styles.amount}>
              <Price amount={item.price} />
            </Text>
          </View>

          <View style={{flex: 2, justifyContent: 'center'}}>

            {item.discountRate && item.discountRate != "" || item.refComDiscountRate && item.refComDiscountRate != "" 
              ? <Text style={styles.compareAtPrice}>
                  {item.compareAtPrice == "" ? null : <Price amount={item.compareAtPrice} />}
                </Text> 
              : <></>
            }
                  
          </View>

          <View style={styles.sold}>
            <Text style={{fontSize: 9}}>
              {item.weeklySold || item.soldCount || 0} sold
            </Text>
          </View>

        </View>

        {item.refComDiscountRate && item.refComDiscountRate != "" ? <RefComDiscountRate value={item.refComDiscountRate} /> : null}

      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container : { 
    flex: 2, 
    backgroundColor: '#fff',
    margin: 10 
  },
  discountView: { 
    position:'absolute', 
    zIndex: 1, 
    right: 0, 
    backgroundColor: '#F6841F', 
    borderBottomLeftRadius: 30 
  },
  discountText: { 
    fontSize: 8, 
    paddingHorizontal: 4, 
    paddingLeft: 8, 
    paddingTop: 1, 
    paddingBottom: 3, 
    color: "#fff", 
    fontFamily: FONT.BOLD 
  },
  images: { 
    resizeMode: 'cover', 
    width: '100%',
    height: 120, 
    borderRadius: 5 
  },
  name: { 
    fontSize: 13, 
    fontWeight: '500',
    paddingVertical: 5 
  },
  amount: { 
    fontSize: 13, 
    color: "#F6841F" 
  },
  compareAtPrice: { 
    fontSize: 9, 
    color: "#9E9E9E", 
    textDecorationLine: 'line-through' 
  },
  sold: {
    flex: 1.3, 
    justifyContent: 'center', 
    alignItems: 'flex-end' 
  }
})