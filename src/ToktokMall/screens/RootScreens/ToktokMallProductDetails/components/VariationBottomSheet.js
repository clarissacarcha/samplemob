import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Image} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE, MEDIUM, FONTS, SIZES, INPUT_HEIGHT, COLORS} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import {coppermask} from '../../../../assets';
import {Price} from '../../../../helpers';

const SampleVariations = [{
  image: coppermask,
  label: "White"
}, {
  image: coppermask,
  label: "Bronze"
}]

export const VariationBottomSheet = forwardRef(({ item, onPressBuyNow, onPressAddToCart, type}, ref) => {
  
  const snapPoints = useMemo(() => [0, 450], []);
  const [stock, setStock] = useState(21)
  const [qty, setQty] = useState(1)
  const [variation, setVariation] = useState("")

  const RenderOptions = ({type, onBuyNow, onAddToCart}) => {

    if(type == 1) //Add to Cart
      return (
        <>
          <View style={{flex: 2}} />
          <TouchableOpacity onPress={() => {
            onAddToCart({qty, variation})
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
          <TouchableOpacity onPress={onBuyNow} style={{flex: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: '#F6841F'}}>
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
            }} 
            style={{flex: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: 'white'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#F6841F"}}>Add to Cart</Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={onBuyNow} style={{flex: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: "#F6841F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 5, backgroundColor: '#F6841F'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14, color: "#FFF"}}>Buy now</Text>
          </TouchableOpacity>
          <View style={{flex: 3}} />
        </>
      )
  }

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
          <View style={{flex: 2}}>
            <Image source={coppermask} style={{width: 80, height: 120, resizeMode: 'cover', borderRadius: 5}} />
          </View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}></View>
              <View style={{flex: 2}}>
                <Text style={{color: "#F6841F", fontSize: 14}}><Price amount={190} /></Text>
                <Text style={{color: "#9E9E9E", fontSize: 12}}>Stock: {stock}</Text>
              </View>
              <View style={{flex: 2, justifyContent: 'center'}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}><Price amount={380} /></Text>
                <Text></Text>
              </View>
              <View style={{flex: 3}}></View>
            </View>
          </View>
          <TouchableOpacity activeOpacity={1} onPress={() => {
            ref.current.close()
          }} style={{flex: 0}}>
            <CustomIcon.EvIcon name="close" size={22} color="#F6841F" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <View>
          <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Select Color</Text>
        </View>
        <View style={{flexDirection: 'row', paddingTop: 16}}>

          <FlatList
            horizontal={true} 
            data={SampleVariations}
            renderItem={({item}, index) => {
              return (
                <>
                  <TouchableOpacity key={index} onPress={() => {
                    setVariation(item.label)
                  }} activeOpacity={1} style={{flex: 0, alignItems: 'center', paddingHorizontal: 8}}>
                    <View style={{borderColor: "#F6841F", borderWidth: item.label == variation ? 1 : 0, paddingHorizontal: 8, borderRadius: 5}}>
                      <Image source={item.image} style={{width: 60, height: 80, resizeMode: 'cover', borderRadius: 5}} />
                    </View>
                    <Text style={{}}>{item.label}</Text>
                  </TouchableOpacity>
                </>
              )
            }}
          />

        </View>
      </View>
      <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Quantity</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <View style={{flex: 2}}></View>
            <View style={{flex: 4, flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => {
                let increment = qty - 1
                if(increment > 0) setQty(increment) 
              }} style={{flex: 1.5, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8, borderColor: "#F8F8F8"}}>
                <CustomIcon.FA5Icon name="minus" size={14} color="#F6841F" />
              </TouchableOpacity>
              <View style={{flex: 2, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8'}}>
                <Text style={{fontSize: 16}}>{qty}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                let increment = qty + 1
                if(increment <= stock) setQty(increment) 
              }} style={{flex: 1.5, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.8, borderColor: "#F8F8F8"}}>
                <CustomIcon.FA5Icon name="plus" size={14} color="#F6841F" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: "#F7F7FA"}} />
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