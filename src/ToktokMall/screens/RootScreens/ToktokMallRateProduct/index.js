import React from 'react';
import {View, Text} from 'react-native';
import {HeaderBack, HeaderRight, HeaderTitle} from '../../../Components';

export const ToktokMallRateProduct = ({navigation}) => {

	navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Ratings', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });

	return (
		<>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Text>Rate Product</Text>
			</View>
		</>
	)
}