import React, {useState} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';

import {Price} from '../../../../../helpers';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg, placeholder} from '../../../../../assets';
import { FONT } from '../../../../../../res/variables';
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'

export const RenderStars = ({value}) => {
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