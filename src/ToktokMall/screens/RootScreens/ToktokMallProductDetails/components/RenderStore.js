import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';
import ContentLoader from 'react-native-easy-content-loader';

export const RenderStore = ({data, loading, isOutOfStock}) => {

  const navigation = useNavigation()

  const getStoreLogo = (raw) => {
    if(typeof raw == "string") return {uri: raw}
    else return clothfacemask
  }

  const margin = () => {
    let x = parseInt(data.totalProducts)
    if(x < 9){
      return 18
    }else if (x < 99){
      return 15
    }
    else {
      return 8
    }
  }

	return (
		<>
			<View style={{paddingVertical: 16, paddingHorizontal: 16}}>
        {/* <ContentLoader 
          loading = {loading} 
          avatar = {false}
          pRows = {1}
          titleStyles = {{height: 30, left: -10, }}
          tWidth = {'50%'}
          paragraphStyles = {{height: 13, left: -10, paddingTop: 14 }}
          pWidth = {'45%'}
        ></ContentLoader> */}
        <TouchableOpacity disabled={isOutOfStock} activeOpacity={1} onPress={() => {
            navigation.navigate("ToktokMallStore", {id: data?.id, searchValue: ""})
          }} style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center'}}>
						<Image source={getStoreLogo(data?.profileImages?.logo)} style={{width: 50, height: 50, resizeMode: 'stretch', borderRadius: 30}} />
					</View>
          <View style={{flex: 5, justifyContent: 'center'}}>
            <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>{data?.shopname}</Text>
            <Text style={{fontSize: 13, color: "#9E9E9E"}}>{data?.address}</Text>
          </View>
          <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Text style={{fontSize: 13, color: "#F6841F"}}>{isOutOfStock ? "" : "Visit Store"}</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={{flexDirection: 'row', paddingVertical: 14}}>
          <View style={{flex: 3, alignItems: 'flex-end'}}>
            <Text style={{fontSize: 18, color: "#F6841F", marginRight: 8}}>4.0</Text>
            <Text>Rating</Text>
          </View>
          <View style={{flex: 1, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 2, height: 20, backgroundColor: '#E9E9E9'}} />
          </View>
          <View style={{flex: 3, alignItems: 'flex-start'}}>
            <Text style={{fontSize: 18, color: "#F6841F", marginLeft: margin(),}}>{data?.totalProducts || 0}</Text>
            <Text>Products</Text>
          </View>
        </View> */}
        
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
{/* 
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <ContentLoader 
          loading = {loading} 
          avatar = {false}
          pRows = {1}
          titleStyles = {{height: 30, left: -10, }}
          tWidth = {'50%'}
          paragraphStyles = {{height: 13, left: -10, paddingTop: 14 }}
          pWidth = {'45%'}
        >
        <View style={{paddingBottom: 16}}>
          <Text style={{fontSize: 14}}>{data?.shopname || 'Shop'} Vouchers</Text>
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
        </ContentLoader>
        
      </View> */}
		</>
	)
}