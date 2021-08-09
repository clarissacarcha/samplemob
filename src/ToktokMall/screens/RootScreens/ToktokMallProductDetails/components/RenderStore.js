import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

export const RenderStore = () => {

  const navigation = useNavigation()

	return (
		<>
			<View style={{paddingVertical: 16, paddingHorizontal: 16}}>
        <TouchableOpacity onPress={() => {
            navigation.navigate("ToktokMallStore", {})
          }} style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center'}}>
						<Image source={clothfacemask} style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 30}} />
					</View>
          <View style={{flex: 5, justifyContent: 'center'}}>
            <Text style={{fontSize: 13}}>Face Mask PH</Text>
            <Text style={{fontSize: 13, color: "#9E9E9E"}}>Malabon, Manila</Text>
          </View>
          <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Text style={{fontSize: 13, color: "#F6841F"}}>Visit Store</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', paddingVertical: 14}}>
          <View style={{flex: 3, alignItems: 'flex-end'}}>
            <Text style={{fontSize: 18, color: "#F6841F", marginRight: 8}}>4.0</Text>
            <Text>Rating</Text>
          </View>
          <View style={{flex: 1, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 2, height: 20, backgroundColor: '#E9E9E9'}} />
          </View>
          <View style={{flex: 3, alignItems: 'flex-start'}}>
            <Text style={{fontSize: 18, color: "#F6841F", marginLeft: 8}}>152</Text>
            <Text>Products</Text>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <View style={{paddingBottom: 16}}>
          <Text style={{fontSize: 14}}>Face Mask PH Vouchers</Text>
        </View>
        <FlatList 
          data={[{
            label: "Free Shipping Voucher",
            validity: "5.14.2021"
          }, {
            label: "20% off on all items",
            validity: "5.23.2021"
          }]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => {
            return (
              <>
                <ImageBackground 
                  source={voucherbg}
                  style={{width: 200, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, marginRight: 12}} 
                  imageStyle={{width: 200, resizeMode: "stretch" }}
                >
                  <Text style={{fontSize: 13, color: "#F6841F"}}>{item.label}</Text>
                  <Text style={{fontSize: 9, color: "#F6841F"}}>Valid until: {item.validity}</Text>
                </ImageBackground>
              </>
            )
          }}
        />
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	)
}