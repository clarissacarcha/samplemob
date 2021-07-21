import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground} from 'react-native';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

const DotList = ({data}) => {
	return (
		<>
			{data.map((item, i) => 
				<View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <CustomIcon.EIcon name="dot-single" size={20} />
          </View>
          <View style={{flex: 9}}>
            <Text style={{fontSize: 13}}>{item}</Text>
          </View>
        </View>)}
		</>
	)
}

export const RenderDescription = ({value}) => {
	return (
		<>
			<View style={{paddingVertical: 16, paddingHorizontal: 16}}>
        <View style={{paddingBottom: 12}}>
          <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Product Description</Text>
        </View>
        <View style={{paddingBottom: 12}}>
          <Text style={{fontSize: 13}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas viverra gravida ac scelerisque metus nulla pharetra.</Text>
        </View>
        <View style={{paddingBottom: 12}}>
          <DotList data={["100% Cotton", "Washable"]} />
        </View>
        <View style={{paddingBottom: 12}}>
          <Text style={{fontSize: 13}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </View>
      </View>
    	<View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	)
}