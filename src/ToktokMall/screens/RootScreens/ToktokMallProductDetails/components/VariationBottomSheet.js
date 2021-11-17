import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Image} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM, FONTS, SIZES, INPUT_HEIGHT, COLORS} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, placeholder} from '../../../../assets';
import {Price} from '../../../../helpers';
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';

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
    
  const snapPoints = useMemo(() => [0, initialSnapPoint], [item]);
  const [stock, setStock] = useState(item?.noOfStocks)
  const [itemprice, setItemPrice] = useState(item?.price)
  const [originalPrice, setOriginalPrice] = useState(item?.compareAtPrice || 0)
  const [qty, setQty] = useState(1)
  const [variation, setVariation] = useState("")
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
    setVariation(variant.Id)
    setImage(variant.images[0] || null)
    setStock(variant.noOfStocks)
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

  const RenderOptions = ({type, onBuyNow, onAddToCart}) => {

    if(type == 1) //Add to Cart
      return (
        <>
          <View style={{flex: 2}} />
          <TouchableOpacity onPress={() => {
            onAddToCart({qty, variation})
            setQty(1)
            }} style={{flex: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: 'white'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#F6841F"}}>Add to Cart</Text>
          </TouchableOpacity>
          <View style={{flex: 2}} />
        </>
      )
    else if(type == 2) //Buy Now
      return (
        <>
          <View style={{flex: 2}} />
          <TouchableOpacity onPress={() => {
            onBuyNow({qty, variation, product})
            setQty(1)
          }} style={{flex: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: '#F6841F'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#FFF"}}>Buy now</Text>
          </TouchableOpacity>
          <View style={{flex: 2}} />
        </>
      )
    else
      return (
        <>
          <View style={{flex: 3}} />
          <TouchableOpacity 
            onPress={() => {
              onAddToCart({qty, variation})
              setQty(1)
            }} 
            style={{flex: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: 'white'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#F6841F"}}>Add to Cart</Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={() => {
            onBuyNow({qty, variation})
            setQty(1)
          }} style={{flex: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: '#F6841F'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#FFF"}}>Buy now</Text>
          </TouchableOpacity>
          <View style={{flex: 3}} />
        </>
      )
  }

  const RenderVariation = ({variant, index}) => {

    return (
      <>
        <TouchableOpacity 
          key={index} 
          onPress={() => {
            // setVariationWithTypes(prevState => ({...prevState, [type]: index}))
            onSelectVariant(variant, index)
          }} 
          style={{
            width: '100%',
            marginTop: 4,
            paddingVertical: 4, 
            paddingHorizontal: 16, 
            borderRadius: 5, 
            borderWidth: 0.5, 
            borderColor: variant.Id === variation ? "#F6841F" : "lightgray"
            // borderColor: "lightgray"
          }}>
          <Text style={{fontSize: 13, color: "#9E9E9E"}}>{variant.itemname}</Text>
        </TouchableOpacity>
        {/* <View style={{width: 5}} /> */}
      </>
    );
  }

  useEffect(() => {
    reset()
  }, [item])

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      // snapPoints = {[0, item?.variations && item?.variations.length > 0 ? '60%' :'50%']}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={() => (
        <View
          style={{
            height: 20,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderTopWidth: 3,
            borderRightWidth: 2,
            borderLeftWidth: 2,
            borderColor: ORANGE,
            marginHorizontal: -2,
          }}
        />
      )}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3}}>
            <Image source={getImage()} style={{width: 100, height: 120, resizeMode: 'cover', borderRadius: 5}} />
          </View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1.5}}></View>
              <View style={{flex: 4}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={itemprice * qty} /></Text>
                  <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11, marginTop: 2.5, marginLeft: 8}}>{originalPrice == 0 ? "" : <Price amount={originalPrice*qty} />}</Text>                
                </View>
                <Text style={{color: "#9E9E9E", fontSize: 12, marginTop: 5}}>Stock: {stock}</Text>
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
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>

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
                    style={{width: '100%', height: 110}}
                    contentContainerStyle={{flex: 0, flexDirection: 'column', justifyContent: 'space-around'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <View style={{
                          flex: 1, 
                          paddingHorizontal: 4,
                          flexWrap: 'wrap',
                          alignItems: 'center'
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

      <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Quantity</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <View style={{flex: 2}}></View>
            <View style={{flex: 4, flexDirection: 'row'}}>
              <TouchableOpacity disabled={qty === 1} onPress={() => {
                let increment = qty - 1
                if(increment > 0) {
                  setQty(increment)
                }
              }} style={{flex: 1.5, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8, borderColor: "#F8F8F8"}}>
                <CustomIcon.FA5Icon name="minus" size={14} color={qty === 1 ? "#9E9E9E":"#F6841F"} />
              </TouchableOpacity>
              <View style={{paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8'}}>
                <Text style={{fontSize: 16}}>{stock >= 1 ? qty : 0}</Text>
              </View>
              <TouchableOpacity disabled={qty === stock} onPress={() => {
                let increment = qty + 1
                if(increment <= stock){
                  setQty(increment) 
                }else{
                  Toast.show("Not enought stocks")
                }
              }} style={{flex: 1.5, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8, borderColor: "#F8F8F8"}}>
                <CustomIcon.FA5Icon name="plus" size={14} color={qty === stock ? "#9E9E9E":"#F6841F"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* {item?.variantSummary && item?.variantSummary.length == 0 && <View style={{flex: 1, height: '15%'}} />} */}

      <View style={{height: 2, backgroundColor: "#F7F7FA", marginBottom: 8}} />
      <View style={{ flex: 1}}>
        <View style={{flex: 3, paddingHorizontal: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
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
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  spacing: {height: 2},
  validID: {
    height: INPUT_HEIGHT,
    justifyContent:"center",
    borderBottomWidth: .2,
    borderColor: "silver",
    paddingHorizontal:12,
  }
});