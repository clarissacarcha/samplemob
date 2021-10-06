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
  image, 
  onPressBuyNow, 
  onPressAddToCart, 
  type
}, ref) => {
    
  const snapPoints = useMemo(() => [0, initialSnapPoint], [item]);
  const [stock, setStock] = useState(item?.noOfStocks)
  const [qty, setQty] = useState(1)
  const [variation, setVariation] = useState("")
  const [variationWithTypes, setVariationWithTypes] = useState({})
  const [variationArr, setVariationArr] = useState([])

  const getImage = () => {
    if(image && typeof image == "object"){
      return {
        uri: image.filename
      }
    }else{
      return placeholder
    }
  }

  useEffect(() => {
    item?.variantSummary &&
      item?.variantSummary.length > 0 &&
      Object.keys(variationWithTypes).length > 0 &&
      setVariation(
        item?.variantSummary
          .map((variant, i) => {
            let variantslist = variant?.variantList || '';
            const variants = variantslist.split(',');
            if (Object.keys(variationWithTypes).includes(variant.variantType)) {
              return variants[variationWithTypes[variant.variantType]];
            }
          })
          .join(' '),
      );
  }, [item, variationWithTypes]);
  console.log(variation)

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
            onBuyNow({qty, variation})
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

  const RenderVariation = ({variants, type}) => {

    return (
      <>
      <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <View>
          <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Select {type}</Text>
        </View>
        <View style={{flexDirection: 'row', paddingTop: 16}}>

          <View style={{flexWrap: "wrap"}}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
            {variants.map((item, index) => {
              return (
                <>
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => {
                      setVariationWithTypes(prevState => ({...prevState, [type]: index}))
                    }} 
                    style={{
                      marginTop: 4,
                      paddingVertical: 4, 
                      paddingHorizontal: 16, 
                      borderRadius: 5, 
                      borderWidth: 0.5, 
                      borderColor: variationWithTypes?.[type] === index ? "#F6841F" : "lightgray"
                    }}>
                    <Text style={{fontSize: 13, color: "#9E9E9E"}}>{item}</Text>
                  </TouchableOpacity>
                  <View style={{width: 5}} />
                </>
              )
            })}
            </View>
          </View>

          </View>
        </View>
      </>
    );
  }

  useEffect(() => {
    setStock(item?.noOfStocks)
  }, [item])

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
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
                  <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={item?.price} /></Text>
                  <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11, marginTop: 2.5, marginLeft: 8}}>{item.compareAtPrice == 0 ? "" : <Price amount={item.compareAtPrice} />}</Text>                
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
            ref.current.close()
          }} style={{flex: 0}}>
            <CustomIcon.EvIcon name="close" size={22} color="#F6841F" />
          </TouchableOpacity>
        </View>
      </View>
      {item?.variantSummary && 
        item?.variantSummary.length > 0 && 
        item?.variantSummary.map((variant, i) => {
          let variantslist = variant?.variantList || ""
          const variants = variantslist.split(",")
          if(variants.length == 0 || variant.variantType == "") return null
          // return (
          //   <ScrollView 
          //     showsVerticalScrollIndicator={false} 
          //     contentContainerStyle={{ flexGrow: 1 }}>
          //     <RenderVariation type={variant.variantType} variants={variants} />
          //   </ScrollView>
          // )
          return (
            <View >
              <RenderVariation type={variant.variantType} variants={variants} />
            </View>
          )
      })}

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
              <View style={{flex: 2, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8'}}>
                <Text style={{fontSize: 16}}>{stock >= 1 ? qty : 0}</Text>
              </View>
              <TouchableOpacity disabled={qty === stock || qty === 200} onPress={() => {
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