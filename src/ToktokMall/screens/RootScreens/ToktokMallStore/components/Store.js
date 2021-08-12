import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {LandingSubHeader, Card, Product} from '../../../../Components';

export const Store = ({data, onToggleFollow}) => {

  const navigation = useNavigation()
  const [following, setFollowing] = useState(data.following)

  const getShopLogo = (raw) => {
    if(typeof raw == "string") return {uri: raw}
    else return require("../../../../assets/images/Cloth-Face-Mask.png")
  }

	return (
		<>
			<View style={{paddingVertical: 15, paddingHorizontal: 15}}>
        <Card>
          <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
            <View style={{flex: 3.5}}>
              <Image source={getShopLogo(data.profileImages?.logo ? data.profileImages?.logo : {})} style={{width: 50, height: 50, resizeMode: "cover", borderRadius: 25}} />
            </View>
            <View style={{flex: 12, justifyContent: 'center'}}>
              <Text style={{fontSize: 14}}>{data.shopname}</Text>
              <Text style={{fontSize: 13, color: "#9E9E9E"}}>{data.address}</Text>
            </View>
            <View style={{flex: 4, justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => {                
                setFollowing(!following)
                onToggleFollow(!following)
              }} style={{paddingVertical: 5, paddingHorizontal: 4, backgroundColor: following ? "#fff" : "#F6841F", borderRadius: 5, borderColor: following ? "#F6841F" : "", borderWidth: following ? 1 : 0, alignItems: 'center'}}>
                <Text style={{color: following ? "#F6841F" : "#fff", fontSize: 11}}>{following ? "Following" : "Follow"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 20, paddingHorizontal: 15}}>
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallProductRatings")
            }} style={{flex: 2.5, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 13, paddingHorizontal: 4}}>Rating <Text style={{fontSize: 13, color: "#F6841F"}}>{data.rating.toFixed(1)}</Text></Text>
            </TouchableOpacity>
            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 2, borderLeftColor: "#E9E9E9", borderRightColor: "#E9E9E9", borderRightWidth: 2, paddingHorizontal: 4}}>
              <Text style={{fontSize: 13}}>Followers <Text style={{fontSize: 13, color: "#F6841F"}}>{data.followers || 286}</Text></Text>
            </View>
            <View style={{flex: 2.5, justifyContent: 'center', paddingHorizontal: 4}}>
              <Text style={{fontSize: 13}}>Products <Text style={{fontSize: 13, color: "#F6841F"}}>{data.totalProducts}</Text></Text>
            </View>
          </View>
        </Card>
      </View>
		</>
	)
}