import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import CustomIcon from '../../../../Components/Icons';

const SampleImage = require("../../../../assets/images/Pet-Care.png")

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
			<View style={styles.stars}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 1 ? orange : gray}  />
			</View>
			<View style={styles.stars}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 2 ? orange : gray}  />
			</View>
			<View style={styles.stars}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 3 ? orange : gray}  />
			</View>
			<View style={styles.stars}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 4 ? orange : gray}  />
			</View>
			<View style={styles.stars}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 5 ? orange : gray}  />
			</View>
    </>
  )
}

const ReviewItem = ({data}) => {
	return (
		<>
			<View style={styles.container}>
					<View style={styles.ratingContainer}>
						<View style={styles.imageContainer}>
							<Image 
								source={SampleImage} 
								style={styles.image}
							/>
						</View>
						<View style={styles.ratingsContainer}>
							<View>
								<Text style={styles.shopText}>{data.shop}</Text>
							</View>
							<View style={styles.ratingTextContainer}>
								<RenderStars value={data.rating} />								
							</View>
						</View>			
					</View>
					<View style={styles.reviewContainer}>
						<Text style={styles.reviewText}>{data.review}</Text>
					</View>
					<View style={styles.imagesContainer}>
						{data.images.length > 0 && 
						data.images.map((item, i) => 
							<View style={styles.imagesSubContainer}>
								<Image source={SampleImage} style={styles.dataImage} />
							</View>
						)}
					</View>
					<View style={styles.dateContainer(data)}>
						<Text style={styles.dateText}>{data.date}</Text>
					</View>					
				</View>
				<View style={styles.margin1} />
		</>
	)
}



export const Review = ({data}) => {

	return (
		<>
			<FlatList 
				data={data || []}
				renderItem={({item}) => <ReviewItem data={item} />}
			/>			
		</>
	)
}

const styles = StyleSheet.create({
	stars: {
		paddingHorizontal: 2
	},
	container: {
		paddingVertical: 15, 
		paddingHorizontal: 15
	},
	ratingContainer: {
		flexDirection: 'row'
	},
	imageContainer: {
		flex: 2, 
		justifyContent: 'center'
	},
	image: {
		width: 50, 
		height: 50, 
		resizeMode: 'cover', 
		borderRadius: 25
	},
	ratingsContainer: {
		flex: 8, 
		justifyContent: 'flex-start'
	},
	shopText: {
		fontSize: 16
	},
	ratingTextContainer: {
		flexDirection: 'row', 
		paddingVertical: 2
	},
	reviewContainer: {
		paddingVertical: 15
	},
	reviewText: {
		fontSize: 13
	},
	imagesContainer: {
		paddingVertical: 0, 
		flexDirection: 'row'
	},
	imagesSubContainer: {
		borderRadius: 5, 
		marginRight: 8
	},
	dataImage: {
		width: 80, 
		height: 90, 
		resizeMode: 'cover', 
		borderRadius: 5
	},
	dateContainer: (data) => {
		return {
			paddingTop: data.images.length > 0 ? 15 : 0
		}
	},
	dateText: {
		fontSize: 10, 
		color: "rgba(33, 37, 41, 0.4)"
	},
	margin1: {
		height: 2, 
		backgroundColor: '#F7F7FA'
	}
})	