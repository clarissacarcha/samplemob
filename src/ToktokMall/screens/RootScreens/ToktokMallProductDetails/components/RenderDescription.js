import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomIcon from '../../../../Components/Icons';;
import { FONT } from '../../../../../res/variables';

const DotList = ({data}) => {
	return (
		<>
			{data.map((item, i) => 
				<View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <CustomIcon.EIcon name="dot-single" size={20} />
          </View>
          <View style={{flex: 9}}>
            <Text style={{fontSize: 13}}>{item}</Text>
          </View>
        </View>)}
		</>
	)
}

export const RenderDescription = ({data, loading}) => {

  const [seeMore, setSeeMore] = useState(false);
  const maxChar = 200
	return (
		<>
      {/* <ContentLoader 
          loading = {loading} 
          avatar = {false}
          pRows = {6}
          title = {false}
          paragraphStyles = {{height: 13, left: 0, top: 15}}
          pWidth = {'100%'}
      ></ContentLoader> */}
        <View style={styles.container}>
          <View style={{paddingBottom: 12}}>
            <Text style={styles.h1}>Product Description</Text>
          </View>          
          <View style={{paddingBottom: 12}}>
            <Text style={{fontSize: 13}}>{data ? data?.summary?.length > maxChar && !seeMore ? 
              (((data.summary).substring(0, maxChar - 3)) + ' .... ') // if description  is more than 200 char
              : data.summary
              : "Product description not available"}
            </Text>
            {
              data?.summary?.length > maxChar ?
                <TouchableOpacity style = {{alignSelf: 'flex-end'}} onPress = {() => {setSeeMore(!seeMore)}}>
                <Text style = {{color: "#F6841F"}}>{!seeMore ? 'See more' : 'See less'}</Text>
               </TouchableOpacity> : null
            }
          </View>
        </View>
        <View style={{height: 8, backgroundColor: '#F7F7FA'}} />      
		</>
	)
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16, 
    paddingHorizontal: 16
  },
  h1:{
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
})