import React from 'react';
import {View, Text, Image, FlatList, SectionList, StyleSheet, TouchableOpacity} from 'react-native';
import { Header } from '../../../../Components';
import {Price} from '../../../../helpers';
import CustomIcon from '../../../../Components/Icons';
import {coppermask, clothfacemask, reviewimage} from '../../../../assets';
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

const RenderReviewItem = () => {
	return (
		<>
			<View style={{paddingVertical: 16, paddingHorizontal: 16}}>
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center'}}>
						<Image source={clothfacemask} style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 30}} />
					</View>
					<View style={{flex: 8, justifyContent: 'center'}}>
						<View>
							<Text style={{fontSize: 14}}>Cloud Panda PH</Text>
						</View>
						<View style={{flexDirection: 'row', paddingVertical: 4}}>
							<View style={{flex: 3, flexDirection: 'row', justifyContent: 'space-between'}}>
								<RenderStars value={5} />
							</View>
							<View style={{flex: 6}} />
						</View>
					</View>
				</View>
				<View style={{paddingVertical: 14}}>
					<Text style={{fontSize: 13}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices nulla at ornare commodo.</Text>					
				</View>
				<View style={{flexDirection: 'row'}}>
					<Image source={reviewimage} style={{width: 70, height: 70, resizeMode: 'cover', borderRadius: 5, marginRight: 8}} />
					<Image source={reviewimage} style={{width: 70, height: 70, resizeMode: 'cover', borderRadius: 5, marginRight: 8}} />
					<Image source={reviewimage} style={{width: 70, height: 70, resizeMode: 'cover', borderRadius: 5, marginRight: 8}} />
				</View>
				<View style={{paddingTop: 8}}>
					<Text style={{fontSize: 10, color: "rgba(33, 37, 41, 0.4)"}}>February 1, 2021</Text>	
				</View>				
			</View>
		</>
	)
}

export const RenderReviews = ({value}) => {

	const items = [1,2]

	return (
		<>
			<View style={{paddingVertical: 16, paddingHorizontal: 16}}>				
				<View style={{flexDirection: 'row'}}>
          <View style={{flex: 8}}>
            <Text style={styles.h1}>Ratings & Reviews</Text>
          </View>
          <TouchableOpacity style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Text style={styles.link}>See all </Text>
          </TouchableOpacity>
          <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
            <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
          </View>
        </View>
				<View style={{flexDirection: 'row', paddingTop: 14}}>
          <View style={{flex: 3, flexDirection: 'row', justifyContent: 'space-between', marginTop: 1}}>
            <RenderStars value={4} />
          </View>
          <View style={{flex: 5, flexDirection: 'row', paddingHorizontal: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 12}}>4.0/5 </Text>
			  			<Text style={{fontSize: 12, color: "#9E9E9E"}}> (120)</Text>
            </View>            
          </View>
          <View style={{flex: 1.8, flexDirection: 'row', justifyContent: 'space-between'}} />
        </View>				
			</View>
			<View style={{height: 2, backgroundColor: '#F7F7FA'}} />
			{items.map((item, i) => {
				return (
					<>
						<RenderReviewItem />
						{i < items.length - 1 && <View style={{height: 2, backgroundColor: '#F7F7FA'}} />}
					</>
				)
			})}
			<View style={{height: 8, backgroundColor: '#F7F7FA'}} />
		</>
	)
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 0},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})