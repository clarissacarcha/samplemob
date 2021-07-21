import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground} from 'react-native';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

export const HeaderTransparent = ({value, outOfStock = false}) => {


  const transparentBg = "rgba(129, 129, 129, 0.5)"

	return (
		<>
			<View style={{position: 'absolute', width: '100%', zIndex: 1, backgroundColor: 'transparent', paddingTop: 40, paddingBottom: 12, paddingHorizontal: 6}}>
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: transparentBg, height: 28, borderRadius: 35/2}}>
            <CustomIcon.MCIcon name="chevron-left" color="#fff" size={28} />
          </View>
          <View style={{flex: 8, justifyContent: 'center'}} />
          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <View style={{flex: 0.5}}></View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transparentBg, height: 28, borderRadius: 35/2}}>
              <CustomIcon.AIcon name="shoppingcart" color="#fff" size={24} />
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transparentBg, height: 28, borderRadius: 35/2}}>
              <CustomIcon.FeIcon name="more-horizontal" color="#fff" size={24} />
            </View>
          </View>        
        </View>
        {outOfStock && 
        <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 150, height: 150, borderRadius: 150/2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 18, color: "#fff"}}>OUT OF STOCK</Text>
          </View>
        </View>}
      </View>      
      <View style={{height: 3, backgroundColor: '#F7F7FA'}} />
		</>
	)
}