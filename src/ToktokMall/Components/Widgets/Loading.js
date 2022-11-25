import React from 'react';
import {View, ActivityIndicator, Platform} from 'react-native';
import Spinner from 'react-native-spinkit';
import LottieView from 'lottie-react-native';
import { success2, loadingLottie } from '../../assets';

export const Loading = ({state, size = 35, type = 'Circle', color = '#F6841F'}) => {
	return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				{
          Platform.OS == "ios" ? 
            <LottieView
              autoPlay={true}
              source={loadingLottie}
              style={{top: -10, width: 80, height: 80}}
            />
            :
            <LottieView
            autoPlay={true}
            source={loadingLottie}
            style={{width: 80, height: 80}}
            />
        }
			</View>
    )
}