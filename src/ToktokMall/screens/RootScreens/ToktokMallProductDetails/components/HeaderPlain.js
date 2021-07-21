import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground} from 'react-native';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

export const HeaderPlain = ({value}) => {
	return (
		<>
			<View style={{flexDirection: 'row', paddingTop: 40, paddingBottom: 12, paddingHorizontal: 6}}>
        <View style={{flex: 1.4, alignItems: 'flex-start', justifyContent: 'center'}}>
          <CustomIcon.MCIcon name="chevron-left" color="#F6841F" size={28} />
        </View>
        <View style={{flex: 8, justifyContent: 'center'}}>
          <Text numberOfLines={1} style={{fontSize: 18}}>Improved Copper Mask 2.0 Bla..</Text>
        </View>
        <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <View style={{flex: 0.5}}></View>
					<View style={{flex: 1, justifyContent: 'center'}}>
            <CustomIcon.AIcon name="shoppingcart" color="#F6841F" size={24} />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <CustomIcon.FeIcon name="more-horizontal" color="#F6841F" size={24} />
          </View>
        </View>
      </View>
      <View style={{height: 3, backgroundColor: '#F7F7FA'}} />
		</>
	)
}