import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg} from '../../../../assets';
import { FONT } from '../../../../../res/variables';

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
      <CustomIcon.FoIcon name="star" size={14} color={value >= 1 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 2 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 3 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 4 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={14} color={value >= 5 ? orange : gray} />
    </>
  )
}

export const RenderProduct = ({onOpenVariations}) => {
	return (
		<>
			<View style={{paddingVertical: 8, paddingHorizontal: 16}}>
        <Text style={{fontSize: 22, fontWeight: '500', fontFamily: FONT.BOLD}}>Improved Copper Mask 2.0 White or Bronze</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{color: "#F6841F", fontSize: 20}}><Price amount={190} /></Text>
          </View>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 14}}><Price amount={380} /></Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingTop: 8}}>
          <View style={{flex: 3, flexDirection: 'row', justifyContent: 'space-between', marginTop: 1}}>
            <RenderStars value={4} />
          </View>
          <View style={{flex: 5, flexDirection: 'row', paddingHorizontal: 12}}>
            <View>
              <Text>4.0/5</Text>
            </View>
            <View style={{paddingHorizontal: 2}} >
              <Text style={{color: "#9E9E9E"}}> | </Text>
            </View>
            <View>
              <Text>187 sold</Text>
            </View>
          </View>
          <View style={{flex: 1.8, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <CustomIcon.EIcon name="heart-outlined" size={22} color="#9E9E9E" />
            </View>
            <View>
              <CustomIcon.FeIcon name="share" size={20} color="#9E9E9E" />
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

      <View style={{paddingVertical: 8, paddingHorizontal: 8}}>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <View style={{flex: 2, flexDirection: 'row', paddingHorizontal: 8}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Select Variation</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: "#9E9E9E"}}>( 2 color )</Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row-reverse'}}>
            <TouchableOpacity onPress={onOpenVariations} style={{flex: 0}}>
              <CustomIcon.MCIcon name="chevron-right" size={24} color="#F6841F" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: 8, flexDirection: 'row', paddingVertical: 8}}>        
          <Image source={coppermask} style={{width: 55, height: 65, resizeMode: 'center', borderColor: "#9E9E9E", borderWidth: 1, marginRight: 4}} />
          <Image source={coppermask} style={{width: 55, height: 65, resizeMode: 'center', borderColor: "#9E9E9E", borderWidth: 1, marginRight: 4}} />
        </View>

      </View>
      <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	)
}