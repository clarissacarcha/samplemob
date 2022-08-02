import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {LandingSubHeader, Card, Product} from '../../../../Components';
import { connect } from 'react-redux';

const Component = ({data, onToggleFollow, reduxActions: {updateMyFollowing}, reduxStates: {myFollowing}}) => {

  const navigation = useNavigation()
  const [following, setFollowing] = useState(false)
  useEffect(()=>{
    myFollowing.map(shop => {
      if(shop.id === data.id){
        setFollowing(true)
      }
    })
  },[myFollowing, data])

  const getShopLogo = (raw) => {
    if(typeof raw == "string") return {uri: raw}
    else return ""
  }

	return (
		<>
			<View style={styles.container}>
          <View style={styles.subContainer}>
            <View style={styles.imageContainer}>
              <Image 
                source={getShopLogo(data.profileImages?.logo ? data.profileImages?.logo : {})} 
                style={styles.logoIcon} />
            </View>
            <View style={styles.shopNameContainer}>
              <Text style={styles.shopNameText}>{data.shopname}</Text>
              <Text style={styles.addressText}>{data.address}</Text>
            </View>

            {/* FOLLOW STORE BUTTON */}
            {/* <View style={{flex: 4, justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => {
                  updateMyFollowing(following ? "unfollow" : "follow", data)
                setFollowing(!following)
                onToggleFollow(!following)
              }} style={{paddingVertical: 5, paddingHorizontal: 4, backgroundColor: following ? "#fff" : "#F6841F", borderRadius: 5, borderColor: following ? "#F6841F" : "", borderWidth: following ? 1 : 0, alignItems: 'center'}}>
                <Text style={{color: following ? "#F6841F" : "#fff", fontSize: 11}}>{following ? "Following" : "Follow"}</Text>
              </TouchableOpacity>
            </View> */}
            {/* FOLLOW STORE BUTTON */}


          </View>
          {/* <View style={{flexDirection: 'row', paddingBottom: 20, paddingHorizontal: 15}}>
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
          </View> */}
      </View>
		</>
	)
}


const mapStateToProps = (state) => ({
  reduxStates: {
    myFollowing: state.toktokMall.myFollowing,
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateMyFollowing: (action, payload) => {
      dispatch({type: 'TOKTOK_MY_FOLLOWING', action, payload});
    },
  },
});

export const Store = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {
    marginTop: 15, 
    marginHorizontal: 15, 
    borderColor: "#ECECEC", 
    borderWidth: 1, 
    borderRadius: 5
  },
  subContainer: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  imageContainer: {
    flex: 3.5, 
    justifyContent: 'center'
  },
  logoIcon: {
    width: 50, 
    height: 50, 
    resizeMode: "stretch", 
    borderRadius: 25
  },
  shopNameContainer: {
    flex: 12, 
    justifyContent: 'center'
  },
  shopNameText: {
    fontSize: 14
  },
  addressText: {
    fontSize: 13, 
    color: "#9E9E9E", 
    paddingRight: 5
  }
})