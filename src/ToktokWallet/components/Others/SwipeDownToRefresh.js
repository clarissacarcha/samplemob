import React from 'react'
import { View , Text ,StyleSheet } from 'react-native' 
import {VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS


export const SwipeDownToRefresh = ()=>   (<View style={{marginHorizontal: SIZE.MARGIN, flexDirection: 'row', paddingVertical: 8}}>
<View style={{width: 22, height: 22, marginHorizontal:16, alignItems: 'center'}}>
  <VectorIcon iconSet={ICON_SET.Entypo} name="arrow-long-down" color={COLOR.MEDIUM} />
</View>
<Text style={{color: COLOR.MEDIUM}}>Swipe down to refresh</Text>
</View>)

