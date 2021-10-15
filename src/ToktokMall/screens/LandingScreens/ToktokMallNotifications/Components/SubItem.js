import React, {useState} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import { Linking } from 'react-native';

export const SubItem = ({index, total, data, root, onSelect}) => {

  let bgcol = "rgba(204, 204, 204, 0.2)"
	const [toggle, setToggle] = useState(false)
	const [clicks, setClicks] = useState(0)

	const renderDescription = (content, value) => {
		const txtStyle = {fontSize: 10, color: "#9E9E9E"}
		if(content.includes("@id")){
			return (
				<>
					<Text style={txtStyle}>
						{content.split("&id")[0]} 
							<Text style={{color: "#F6841F", fontSize: 12}}>{value.id}</Text> 
						{content.split("&id")[1]}
					</Text>
				</>
			)
		}else if(content.includes("@link")){
			return (
				<>
					<View style={{flexDirection: 'row'}}>
						<Text style={txtStyle}>{content.split("@link")[0]}</Text> 
						<TouchableOpacity onPress={() => {
							Linking.openURL(value.hasLink)
						}}>
							<Text style={{color: "#F6841F", fontSize: 12}}>Delivery Link</Text>	
						</TouchableOpacity> 
						<Text style={txtStyle}>{content.split("@link")[1]}</Text>
					</View>
				</>
			)
		}else{
			return (
				<Text style={txtStyle}>{content}</Text>
			)
		}
	}

  return (
  	<>
    	<View style={{flexDirection: 'row', backgroundColor: clicks == 0 ? bgcol : "white"}}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15}}>
          <View style={{flex: 1, backgroundColor: index == 0 ? 'transparent' : "#C4C4C4", width: '3%'}}></View>
          <CustomIcon.MCIcon name="circle" size={9} color="#C4C4C4" style={{position: 'absolute'}} />
          <View style={{flex: 1, backgroundColor: total - 1 == index ? "transparent" : "#C4C4C4", width: '3%'}}></View>
        </View>
        <TouchableOpacity onPress={() => {
					// setToggle(true)
					if(clicks == 0){
						setClicks(clicks + 1)
					}
					onSelect()
				}} style={{flex: 12, paddingHorizontal: 0, paddingTop: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 4}}>
              <Text style={{fontSize: 12, color: "#707171", textTransform: 'capitalize'}}>{data?.action}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row-reverse', paddingHorizontal: 15}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>{data?.formatDate}</Text>
            </View>
          </View>
          <View>
            <View style={{paddingRight: 15}}>
              {renderDescription(data?.content, data)}
            </View>                            
          </View>
					<View style={{paddingTop: 15}}>
						{index < total - 1 ? <View style={{ height: 1.5, backgroundColor: 'rgba(0, 0, 0, 0.02)'}} /> : null}
					</View>  
        </TouchableOpacity>				
      </View>
			{/* <View style={{flexDirection: 'row'}}>
				<View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, height: 0, backgroundColor: 'red'}}>

				</View>				
				<View style={{flex: 12, height: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)'}}></View>
			</View> */}
    </>
  )
}
