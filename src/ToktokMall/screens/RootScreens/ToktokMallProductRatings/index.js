import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {HeaderBack, HeaderRight, HeaderTitle} from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import { ScrollView } from 'react-native-gesture-handler';

import {Review, SliderTab} from './components';

const testdata = [
	{
		shop: "Cloud Panda PH",
		images: [1, 2, 3],
		review: "Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Aenean ultrices nulla at ornare commodo.",
		rating: 4,
		date: "February 1, 2021"
	}, {
		shop: "Cloud Panda PH",
		images: [],
		review: "Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Aenean ultrices nulla at ornare commodo.",
		rating: 3,
		date: "February 1, 2021"
	}, {
		shop: "Cloud Panda PH",
		images: [1, 2, 3],
		review: "Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Aenean ultrices nulla at ornare commodo.",
		rating: 5,
		date: "February 1, 2021"
	}, {
		shop: "Cloud Panda PH",
		images: [],
		review: "Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Aenean ultrices nulla at ornare commodo.",
		rating: 1,
		date: "February 1, 2021"
	}
]

export const ToktokMallProductRatings = ({navigation}) => {

	const [activeTab, setActiveTab] = useState(0)
	const [filteredData, setFilteredData] = useState(testdata)

	const TabChangeHandler = (index) => {

		if(index == 0){					//All Comments
			setFilteredData(testdata)
		} else if(index == 1){		//Photos & Reviews
			const filtered = testdata.filter((value) => value.images.length > 0)
			setFilteredData(filtered)
		} else if(index == 2){		// 5 stars
			const filtered = testdata.filter((value) => value.rating == 5)
			setFilteredData(filtered)
		} else if(index == 3){		// 4 stars
			const filtered = testdata.filter((value) => value.rating == 4)
			setFilteredData(filtered)
		} else if(index == 4){		// 3 stars
			const filtered = testdata.filter((value) => value.rating == 3)
			setFilteredData(filtered)
		} else if(index == 5){		// 2 stars
			const filtered = testdata.filter((value) => value.rating == 2)
			setFilteredData(filtered)
		} else if(index == 6){		// 1 stars
			const filtered = testdata.filter((value) => value.rating == 1)
			setFilteredData(filtered)
		}

		setActiveTab(index)
	}

	navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Ratings', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

	return (
		<>
			<View style={styles.container}>

				<SliderTab index={activeTab} onTabChange={(index) => TabChangeHandler(index)} />		

				<Review data={filteredData} />

			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: "#fff"
	},
})