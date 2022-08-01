import React from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import CustomIcon from '../../../../Components/Icons';

const SampleImage = require("../../../../assets/images/Pet-Care.png")

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
			<View style={{paddingHorizontal: 2}}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 1 ? orange : gray}  />
			</View>
			<View style={{paddingHorizontal: 2}}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 2 ? orange : gray}  />
			</View>
			<View style={{paddingHorizontal: 2}}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 3 ? orange : gray}  />
			</View>
			<View style={{paddingHorizontal: 2}}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 4 ? orange : gray}  />
			</View>
			<View style={{paddingHorizontal: 2}}>
				<CustomIcon.FoIcon name="star" size={14} color={value >= 5 ? orange : gray}  />
			</View>
    </>
  )
}

const ReviewItem = ({data}) => {
	return (
		<>
			<View style={{paddingVertical: 15, paddingHorizontal: 15}}>
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 2, justifyContent: 'center'}}>
							<Image 
								source={SampleImage} 
								style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 25}}
							/>
						</View>
						<View style={{flex: 8, justifyContent: 'flex-start'}}>
							<View>
								<Text style={{fontSize: 16}}>{data.shop}</Text>
							</View>
							<View style={{flexDirection: 'row', paddingVertical: 2}}>
								<RenderStars value={data.rating} />								
							</View>
						</View>			
					</View>
					<View style={{paddingVertical: 15}}>
						<Text style={{fontSize: 13}}>{data.review}</Text>
					</View>
					<View style={{paddingVertical: 0, flexDirection: 'row'}}>
						{data.images.length > 0 && 
						data.images.map((item, i) => 
							<View style={{borderRadius: 5, marginRight: 8}}>
								<Image source={SampleImage} style={{width: 80, height: 90, resizeMode: 'cover', borderRadius: 5}} />
							</View>
						)}
					</View>
					<View style={{paddingTop: data.images.length > 0 ? 15 : 0}}>
						<Text style={{fontSize: 10, color: "rgba(33, 37, 41, 0.4)"}}>{data.date}</Text>
					</View>					
				</View>
				<View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
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