import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';

export const RenderFooter = ({onPressVisitStore, onPressBuyNow, onPressAddToCart}) => {
	return (
		<>
			<View style={{flex: 1, backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8}}>
          <View style={{flex: 2}} />
          <View style={{flex: 3, paddingHorizontal: 4}}>
            <TouchableOpacity onPress={onPressBuyNow} style={{backgroundColor: '#F6841F', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: "#F6841F", borderWidth: 1}}>
              <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 2}} />
        </View>
      </View>
		</>
	)
}