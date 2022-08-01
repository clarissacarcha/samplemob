import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';

export const Loading = ({state, size = 35, type = 'Circle', color = '#F6841F'}) => {
	return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Spinner 
          isVisible={state}
          type={type}
          color={color}
          size={size}
        />
			</View>
    )
}