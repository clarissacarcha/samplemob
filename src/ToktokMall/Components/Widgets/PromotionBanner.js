import React from 'react'
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';

export const PromotionBanner = ({label, content}) => {
	return (
		<>
			<View style={{position: 'absolute', zIndex: 2, top: 85, width: '103%', flexDirection: 'row'}}>
              
        <View style={{justifyContent: 'center', flex: 1}}>
                
          <View style={{backgroundColor: '#C02C2F', flexDirection: 'row', marginLeft: 10}}>
            <View style={{flex: 2.5}} />
            <View style={{flex: 4, paddingVertical: 7}}>
              <Text style={{fontSize: 9, color: '#fff', textTransform: 'uppercase', fontWeight: 'bold'}}>{content}</Text>
            </View>
          </View>

          <ImageBackground
            source={require("../../assets/images/promobanner.png")}
            imageStyle={{width: 60, height: 60, resizeMode: 'stretch'}}
            style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}
          >        	
						<View style={{ alignItems: 'center', justifyContent: 'center', width: 60, height: 60}}>
            	<Text style={{fontSize: 7.5, color: '#fff', textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold'}}>{label}</Text>
          	</View>
        	</ImageBackground>

        </View>
      </View>
		</>
	)
}