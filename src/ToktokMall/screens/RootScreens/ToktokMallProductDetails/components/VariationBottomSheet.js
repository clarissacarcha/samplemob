import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Image, Platform} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM, FONTS, SIZES, INPUT_HEIGHT, COLORS} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, placeholder} from '../../../../assets';
import {Price} from '../../../../helpers';
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import { EventRegister } from 'react-native-event-listeners';

const SampleVariations = [{
  image: coppermask,
  label: "White"
}, {
  image: coppermask,
  label: "Bronze"
}]

export const VariationBottomSheet = forwardRef(({ 
  initialSnapPoint, 
  item, 
  onPressBuyNow, 
  onPressAddToCart, 
  onSelectVariation,
  type
}, ref) => {
    
  const snapPoints = useMemo(() => [0, item?.variations?.length > 0 ? 400 : 300], [item]);
  const [stock, setStock] = useState(item?.noOfStocks)
  const [itemprice, setItemPrice] = useState(item?.price)
  const [originalPrice, setOriginalPrice] = useState(item?.compareAtPrice || 0)
  const [qty, setQty] = useState(1)
  const [variation, setVariation] = useState("")
  const [isContinueSelling, setIsContinueSelling] = useState(item?.contSellingIsset)
  const [variationWithTypes, setVariationWithTypes] = useState({})
  const [variationArr, setVariationArr] = useState([])
  const [image, setImage] = useState(item?.images ? item?.images[0] : null)
  const [product, setProduct] = useState(item)

  const getImage = () => {
    if(image && typeof image == "object"){
      return {
        uri: image.filename
      }
    }else{
      return placeholder
    }
  }

  const onSelectVariant = (variant, index) => {
    if(variant.Id === variation){
      return reset()
    }
    setVariation(variant.Id)
    setImage(variant.images[0] || null)
    setStock(variant.noOfStocks)
    // setQty(prevState => variant.noOfStocks >= prevState && prevState !==0 ? prevState : 1)
    setQty(1)
    setItemPrice(variant.price)
    setOriginalPrice(variant.compareAtPrice)
    setProduct(variant)
    onSelectVariation(variant.Id, variant.images || [])
  }

  const reset = () => {
    setVariation("")
    setImage(item?.images ? item?.images[0] : null)
    setStock(item?.noOfStocks)
    setItemPrice(item?.price)
    setOriginalPrice(item?.compareAtPrice)
    setIsContinueSelling(item?.contSellingIsset)
    setQty(1)
    setProduct(item)
    onSelectVariation("")
  }

  // useEffect(() => {
  //   item?.variantSummary &&
  //     item?.variantSummary.length > 0 &&
  //     Object.keys(variationWithTypes).length > 0 &&
  //     setVariation(
  //       item?.variantSummary
  //         .map((variant, i) => {
  //           let variantslist = variant?.variantList || '';
  //           const variants = variantslist.split(',');
  //           if (Object.keys(variationWithTypes).includes(variant.variantType)) {
  //             return variants[variationWithTypes[variant.variantType]];
  //           }
  //         })
  //         .join(' '),
  //     );
  // }, [item, variationWithTypes]);
  // console.log(variation)

  const RenderQuantity = () => {

    const getValue = () => {
      if(!isContinueSelling){
        if(stock >= 1){
          return qty
        }else return 0
      }else if(isContinueSelling){
        return qty
      }else {
        return 0
      }
    }

    const isMinusDisabled = () => {
      if(!isContinueSelling && qty === 1 || !isContinueSelling && stock === 0) return true
      else if(isContinueSelling == 1 && qty === 1) return true
      else if(isContinueSelling == 1 && qty > 1) return false
      else return false
    }

    const isPlusDisabled = () => {
      if(!isContinueSelling && qty >= stock) return true
    }

    return (
      <>
        <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
        <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Quantity</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
              <View style={{flex: 2}}></View>
              <View style={{flex: 4, flexDirection: 'row'}}>
                <TouchableOpacity disabled={isMinusDisabled()} onPress={() => {
                  let increment = qty - 1
                  if(increment > 0) {
                    setQty(increment)
                  }
                }} style={styles.quantityButton}>
                  <CustomIcon.FA5Icon name="minus" size={14} color={isMinusDisabled() ? "#9E9E9E":"#F6841F"} />
                </TouchableOpacity>
                <View style={styles.quantityText}>
                  <Text style={{fontSize: 16}}>{getValue()}</Text>
                </View>
                <TouchableOpacity disabled={isPlusDisabled()} onPress={() => {
                  let increment = qty + 1                 
                  if(increment <= stock && isContinueSelling === 0){
                    setQty(increment) 
                  }else if(isContinueSelling === 1){
                    setQty(increment) 
                  }else{
                    Toast.show("Not enought stocks")
                  }
                }} style={styles.quantityButton}>
                  <CustomIcon.FA5Icon name="plus" size={14} color={isPlusDisabled() ? "#9E9E9E":"#F6841F"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }

  const RenderOptions = ({type, onBuyNow, onAddToCart}) => {

    if(type == 1){ //Add to Cart
      return (
        <>
          <View style={{flex: 2}} />
          <TouchableOpacity 
            disabled={!isContinueSelling && stock === 0} 
            onPress={() => {
              onAddToCart({qty, variation})
              setQty(1)
            }} 
            style={[
              styles.addToCartButton,
              { borderColor: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F" }
            ]}>
              <Text 
                style={[
                  styles.addtoCartText,
                  { color: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F" }
                ]}>
                  Add to Cart
                </Text>
          </TouchableOpacity>
          <View style={{flex: 2}} />
        </>
      )
    } else if(type == 2){ //Buy Now
      return (
        <>
          <View style={{flex: 2}} />
          <TouchableOpacity  
            disabled={!isContinueSelling && stock === 0} 
            onPress={() => {
              onBuyNow({qty, variation, product})
              setQty(1)
             }} 
            style={[
              styles.buyNowButton, {
              borderColor: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F", 
              backgroundColor: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F"
            }]}>
              <Text style={styles.buyNowText}>Buy now</Text>
          </TouchableOpacity>
          <View style={{flex: 2}} />
        </>
      )
    } else {
      return (
        <>
          <View style={{flex: 3}} />
          <TouchableOpacity 
            disabled={!isContinueSelling && stock === 0}
            onPress={() => {
              onAddToCart({qty, variation})
              setQty(1)
            }} 
            style={[
              styles.addToCartButton,{ 
                flex: 8,
                borderColor: stock === 0 ? "#9E9E9E":"#F6841F" 
            }]}>
              <Text 
                style={[
                  styles.addtoCartText,{ 
                    color: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F"
              }]}>
                  Add to Cart
              </Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <TouchableOpacity 
            disabled={!isContinueSelling && stock === 0} 
            onPress={() => {
              onBuyNow({qty, variation})
              setQty(1)
            }} 
            style={[
              styles.buyNowButton,{
              borderColor: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F", 
              backgroundColor: !isContinueSelling && stock === 0 ? "#9E9E9E":"#F6841F"
            }]}>
              <Text style={styles.buyNowText}>Buy now</Text>
          </TouchableOpacity>
          <View style={{flex: 3}} />
        </>
      )
    }
  }

  const RenderVariation = ({variant, index}) => {

    return (
      <>
        <TouchableOpacity 
          key={index}
          onPress={() => {
            onSelectVariant(variant, index)
          }} 
          style={[
            styles.variationSubContainer,
            { borderColor: variant.Id === variation ? "#F6841F" : "lightgray" }
          ]}>
            <Text style={{fontSize: 13, color: "#9E9E9E"}}>{variant.itemname}</Text>
        </TouchableOpacity>
      </>
    );
  }

  const init = () => {
    reset()
    if(item?.variations && item?.variations.length !== 0){
      for(var variant of item.variations){
        if(variant.noOfStocks !== 0){
          setVariation(variant.Id)
          setStock(variant.noOfStocks)
          setItemPrice(variant.price)
          setOriginalPrice(variant.compareAtPrice)
          onSelectVariation(variant.Id, variant.images || [])
          break;
        }
      }
    }
  }

  useEffect(() => {
    init()
    EventRegister.addEventListener("refreshAutoSelectVariation", init)
  }, [item])

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      // snapPoints = {[0, item?.variations && item?.variations.length > 0 ? '60%' :'50%']}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={() => <View style={styles.bottomSheetContainer}/>}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3}}>
            <Image source={getImage()} style={styles.itemImages} />
          </View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1.5}}></View>
              <View style={{flex: 6}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.itemPrice}><Price amount={itemprice * qty} /></Text>
                  <Text style={styles.itemOriginalPrice}>
                    {originalPrice == 0 ? "" : <Price amount={originalPrice*qty} />}
                  </Text>                
                </View>
                <Text style={styles.itemStocks}>
                  Stock: {isContinueSelling == 1 && stock <= 0 ? "pre-order" : stock}
                </Text>
              </View>
              <View style={{flex: 6, justifyContent: 'center'}}>
                <Text style={{marginTop: 8}}></Text>
              </View>
              <View style={{flex: 1}}></View>
            </View>
          </View>
          <TouchableOpacity activeOpacity={1} onPress={() => {
            reset()
            ref.current.close()
          }} style={{flex: 0}}>
            <CustomIcon.EvIcon name="close" size={22} color="#F6841F" />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.variations && item.variations.length > 0 &&
        <>
          <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
          <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
            <View>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Select Variation</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 16}}>          
              <View style={{flexWrap: "wrap"}}>
                <View style={styles.variationContainer}>

                {/* {
                  item?.variations && 
                  item?.variations.length > 0 && 
                  item?.variations.map((variant, i) => {          
                    return (
                      <View style={{paddingHorizontal: 4}}>
                        <RenderVariation variant={variant} index={i} />
                      </View>
                    )
                  })
                } */}

                  <FlatList 
                    vertical={true}
                    data={item?.variations && item?.variations.sort((a, b) => a.itemname.localeCompare(b.itemname)) || []}
                    keyExtractor={(item, index) => item + index}
                    numColumns={2}
                    style={{width: '100%', height: 60}}
                    contentContainerStyle={{flex: 0, flexDirection: 'column', justifyContent: 'space-around'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      console.log("item", item)
                      return (
                        <View style={{
                          flex: .5, 
                        }}>
                          <RenderVariation variant={item} index={index} />
                          {item?.variations && index >= item?.variations.length - 1 ? <View style={{height: 4}} /> : null}
                        </View>
                      )
                    }}
                  />

                </View>
              </View>
            </View>
          </View>
        </>
      }

      <RenderQuantity />

      {/* {item?.variantSummary && item?.variantSummary.length == 0 && <View style={{flex: 1, height: '15%'}} />} */}

      <View style={{height: 2, backgroundColor: "#F7F7FA", marginBottom: 8}} />
      <View style={{ flex: 1}}>
        <View style={styles.buttonContainer}>
          <RenderOptions 
            type={type} 
            onBuyNow={onPressBuyNow}
            onAddToCart={onPressAddToCart}
          />
        </View>
      </View>
    </BottomSheet>
  );
})

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: ORANGE,
    marginHorizontal: -2,
  },
  itemImages: {
    width: 100, 
    height: 120, 
    resizeMode: 'cover', 
    borderRadius: 5, 
    marginBottom: 15
  },
  itemPrice: {
    color: "#F6841F", 
    fontSize: 14, 
    paddingLeft: Platform.OS != "ios" ? 0 : 20
  },
  itemOriginalPrice: {
    color: "#9E9E9E", 
    textDecorationLine: 'line-through', 
    fontSize: 11, 
    marginTop: 2.5, 
    marginLeft: 8, 
    paddingLeft: Platform.OS != "ios" ? 0 : 20
  },
  itemStocks: {
    color: "#9E9E9E", 
    fontSize: 12, 
    marginTop: 5, 
    paddingLeft: Platform.OS != "ios" ? 0 : 20
  },
  box: {
    marginBottom: 20,
  },
  variationContainer:{
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start'
  },
  variationSubContainer: {
    width: '100%',
    marginTop: 4,
    paddingVertical: 4, 
    paddingHorizontal: 16, 
    borderRadius: 5, 
    borderWidth: 0.5
  },
  sheet: {
    paddingHorizontal: 16,
  },
  spacing: {
    height: 2
  },
  validID: {
    height: INPUT_HEIGHT,
    justifyContent:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    paddingHorizontal:12,
  },
  quantityButton: {
    flex: 1.5, 
    paddingHorizontal: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 0.8, 
    borderColor: "#F8F8F8"
  }, quantityText:{
    paddingHorizontal: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F8F8F8'
  },
  buttonContainer: {
    flex: 3, 
    paddingHorizontal: 0, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around'
  },
  addToCartButton:{
    flex: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    paddingHorizontal: 20,
    paddingVertical: 12, 
    borderRadius: 5, 
    backgroundColor: 'white'
  },
  addtoCartText:{
    fontFamily: FONT.BOLD, 
    fontSize: 14
  },
  buyNowButton:{
    flex: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 5, 
  },
  buyNowText:{
    fontFamily: FONT.BOLD, 
    fontSize: 14,
    color: "#FFF"
  },
});