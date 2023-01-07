import React from 'react';
import {Text, View, FlatList, Image, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import HomeIcon from '../../assets/toktokgo/HomeIcon.png';
import OfficeIcon from '../../assets/toktokgo/OfficeIcon.png';
import CustomIcon from '../../assets/toktokgo/SavedIcon.png';
import editIcon from '../../assets/toktokgo/editIcon.png';
import saveIcon from '../../assets/toktokgo/saveIcon.png';
import normalize from 'react-native-normalize';

const windowWidth = Dimensions.get('window').width;

export const LocationCard = ({navigation, item, image, onPress, lastItem = false}) => {
  const navigateToAddSavedAddress = () => {
    navigation.push('ToktokAddEditLocation', {
      coordsFromService: item?.place?.location,
      formattedAddress: item?.place?.formattedAddress,
    });
  };
  return (
    <>
      <View style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row', paddingRight: image ? 20 : 0, width: windowWidth * 0.8}}>
          {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />}
          <TouchableOpacity onPress={() => onPress(item)}>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>
              {item.place.addressBreakdown.city == null
                ? item.place.addressBreakdown.province
                : item.place.addressBreakdown.city}
            </Text>
            <Text
              style={{
                fontSize: CONSTANTS.FONT_SIZE.S,
                color: CONSTANTS.COLOR.ALMOST_BLACK,
              }}>
              {item.place.formattedAddress}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={navigateToAddSavedAddress} style={{position: 'absolute', right: 25, top: 35}}>
        <Image source={saveIcon} resizeMode={'contain'} style={{width: normalize(15), height: normalize(15)}} />
      </TouchableOpacity>
      {!lastItem && <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />}
    </>
  );
};

export const SavedAddressCard = ({navigation, item, image, onPress, lastItem = false}) => {
  const navigateToEditSavedAddress = () => {
    console.log('id', item?.id);
    navigation.push('ToktokAddEditLocation', {addressIdFromService: item?.id});
  };
  return (
    <>
      <View style={{paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row'}}>
          {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />}
          <TouchableOpacity onPress={() => onPress(item)}>
            {item.isHome && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={HomeIcon}
                  resizeMode={'contain'}
                  style={{width: normalize(14), height: normalize(14), marginRight: 6}}
                />
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>Home</Text>
              </View>
            )}
            {item.isOffice && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={OfficeIcon}
                  resizeMode={'contain'}
                  style={{width: normalize(14), height: normalize(14), marginRight: 6}}
                />
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>Office</Text>
              </View>
            )}
            {item.label != null && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={CustomIcon}
                  resizeMode={'contain'}
                  style={{width: normalize(14), height: normalize(14), marginRight: 5}}
                />
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.BLACK}}>{item.label}</Text>
              </View>
            )}
            <View style={{width: windowWidth * 0.8, marginLeft: 18}}>
              <Text
                style={{
                  fontSize: CONSTANTS.FONT_SIZE.S,
                  color: CONSTANTS.COLOR.ALMOST_BLACK,
                }}>
                {item.place.formattedAddress}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToEditSavedAddress}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image source={editIcon} resizeMode={'contain'} style={{width: normalize(15), height: normalize(15)}} />
          </TouchableOpacity>
        </View>
      </View>
      {!lastItem && <View style={{borderBottomWidth: 2, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />}
    </>
  );
};
