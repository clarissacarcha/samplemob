import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import { FONT } from '../../../../../res/variables';
import { Header } from '../../../../Components';
import CustomIcon from '../../../../Components/Icons';

export const RenderFooter = ({onPressVisitStore, onPressBuyNow, onPressAddToCart}) => {
	return (
		<>
			<View style={{flex: 1, backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8}}>
          <View style={{flex: 1.8, paddingHorizontal: 4}}>
            <TouchableOpacity onPress={onPressVisitStore} style={{backgroundColor: '#FFF', flexDirection: 'row', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 5,  borderColor: "#F6841F", borderWidth: 1}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <CustomIcon.MIcon name="store" size={14} color="#F6841F" />
              </View>
              <View style={{flex: 4, alignItems: 'center'}}>
                <Text style={{fontSize: 13, color: '#F6841F'}}>Visit Store</Text>
              </View>              
            </TouchableOpacity>
          </View>
          <View style={{flex: 3, paddingHorizontal: 4}}>
            <TouchableOpacity onPress={onPressBuyNow} style={{backgroundColor: '#F6841F', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: "#F6841F", borderWidth: 1}}>
              <Text style={{fontSize: 14, color: '#fff'}}>Buy now</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1.8, paddingHorizontal: 4}}>
            <TouchableOpacity onPress={onPressAddToCart} style={{backgroundColor: '#FFF', paddingVertical: 12, alignItems: 'center', justifyContent: 'center',  borderRadius: 5, borderColor: "#F6841F", borderWidth: 1}}>
              <Text style={{fontSize: 13, color: '#F6841F', fontFamily: FONT.BOLD}}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
		</>
	)
}