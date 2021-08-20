import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {coppermask} from '../../../../../../assets';
import CheckBox from 'react-native-check-box';
import {FONT} from '../../../../../../../res/variables';

export const Store = ({data}) => {
  return (
    <>
      <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 20}}>
        <View style={{flex: 0}}>
          <Image
            source={require('../../../../../../assets/icons/store.png')}
            style={{width: 24, height: 24, resizeMode: 'stretch'}}
          />
        </View>
        <View style={{flex: 1, paddingHorizontal: 7.5, justifyContent: 'center'}}>
          <Text style={{fontSize: 14}}>{data.shopname}</Text>
        </View>
      </View>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  );
};

export const Item = ({data, onHold, onChecked, willDelete}) => {
  const [selected, setSelected] = useState(false);

  const RenderCheckBox = () => {
    return (
      <>
        <View style={{flex: 0, justifyContent: 'center'}}>
          <CheckBox
            isChecked={selected}
            checkedCheckBoxColor="#F6841F"
            uncheckedCheckBoxColor="#F6841F"
            onClick={() => {
              onChecked(data);
              setSelected(!selected);
            }}
          />
        </View>
      </>
    );
  };

  const RenderInStock = ({images}) => {
    return (
      <>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image
            source={images && images.length > 0 ? {uri: images[0].filename} : coppermask}
            style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}}
          />
        </View>
      </>
    );
  };

  const RenderOutOfStock = ({images}) => {
    return (
      <>
        <ImageBackground
          source={images && images.length > 0 ? {uri: images[0].filename} : coppermask}
          style={{flex: 2.5, justifyContent: 'center', alignItems: 'center', paddingRight: 8, borderRadius: 5}}
          imageStyle={{resizeMode: 'center'}}>
          <View
            style={{
              flex: 0,
              position: 'absolute',
              paddingVertical: 24,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 10, color: '#fff', fontFamily: FONT.BOLD}}>OUT OF STOCK</Text>
          </View>
        </ImageBackground>
      </>
    );
  };
  return (
    <>
      <TouchableOpacity onLongPress={onHold} style={{flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15}}>
        {willDelete && <RenderCheckBox />}
        {data.noOfStocks && data.noOfStocks > 0 ? <RenderInStock images={data.images} /> : <RenderOutOfStock images={data.images} />}
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}}>{data.itemname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: '#F6841F'}}>&#8369;{parseFloat(data.price).toFixed(2)}</Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                {data.comparedAtPrice && <Text style={{color: '#9E9E9E', textDecorationLine: 'line-through', fontSize: 11}}>
                  &#8369;{parseFloat(data.comparedAtPrice).toFixed(2)}
                </Text>}
              </View>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 5}}>
              <View style={{flex: 2}}>
                {data.variationSummary && <Text style={{color: '#9E9E9E', fontSize: 13}}>Variation: {data.variation}</Text>}
              </View>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <View style={{paddingVertical: 2, paddingHorizontal: 8, backgroundColor: '#F6841F', borderRadius: 5}}>
                  <Text style={{color: '#fff', fontSize: 11}}>Add to Cart</Text>
                </View>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  );
};
