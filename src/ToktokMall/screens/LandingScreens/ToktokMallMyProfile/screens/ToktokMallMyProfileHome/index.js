import React from 'react';
import {View, Text, ImageBackground, TouchableOpacity, Image} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {Card} from '../../../../../Components'
import CustomIcon from './.../../../../../../../Components/Icons'

export const ToktokMallMyProfileHome = ({navigation}) => {

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground 
        source={require("../../../../../../assets/toktokmall-assets/images/banner.png")}
        imageStyle={{ resizeMode: "cover", width: '100%'}}
        style={{width: "100%", height: 160}}
      >
        <View style={{flex: 1}}></View>
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10}}>
          <View style={{flex: 3, alignItems: 'center'}}>
            <Image source={require("../../../../../../assets/images/user-icon.png")} style={{width: 80, height: 80, resizeMode: 'cover'}} />
          </View>
          <View style={{flex: 0.3}}></View>
          <View style={{flex: 8}}>
            <Text style={{fontSize: 15, fontFamily: FONT.BOLD}}>Cloud Panda</Text>
            <Text style={{fontSize: 11, fontWeight: '800'}}>+639101738451</Text>
            <Text style={{fontSize: 11, fontWeight: '800'}}>10F Inoza Tower, 40th Street, Bonifacio Global City</Text>
          </View>
        </View>            
      </ImageBackground>

      <View style={{flex: 1, padding: 15}}>

        <Card>
          <View style={{flexDirection: 'row', padding: 20}}>
            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require("../../../../../../assets/toktokwallet-assets/toktokwallet.png")} style={{width:'100%', height: 20, resizeMode: 'stretch'}} />
            </View>
            <View style={{flex: 4, alignItems: 'flex-start', justifyContent: 'center'}}>
              <Text style={{fontSize: 11, marginLeft: 8, color: COLOR.DARK}}>(Balance P2000.00)</Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 13, fontFamily: FONT.REGULAR, color: COLOR.ORANGE}}>Top up</Text>
            </View>
          </View>
        </Card>
        
        <View style={{height: 15}}></View>

        <Card>
          <View style={{paddingVertical: 10 }}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>My Orders</Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="truck" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Ship</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 1})} style={{flex: 2,  alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="package" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Recieve</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="comment-check-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="comment-remove-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Cancelled</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <View style={{height: 15}}></View>

        <Card>
          <View style={{paddingVertical: 10 }}>            
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyWishlist", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.EIcon name="heart-outlined" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Favorites</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyFollowing", {tab: 1})} style={{flex: 2,  alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="store" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Following</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyVouchers", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="ticket-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>My Vouchers</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallHelp", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="help-circle" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

      </View>

    </View>
  );
};
