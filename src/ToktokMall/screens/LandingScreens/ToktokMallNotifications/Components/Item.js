import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import { DisplayDate } from '../../../../helpers';
import { placeholder } from '../../../../assets';
import {useNavigation} from "@react-navigation/native";
import {NewTouchableOpacity} from '../../../../Components/Widgets'

export const Item = ({active, data, onSelect}) => {

  const navigation = useNavigation()
  const [orderStatus, setOrderStatus] = useState({})

  useEffect(() => {
    if(data){
      setOrderStatus(data.orderStatusLatest)
    }
  }, [data])

	const getImage = (raw) => {

		if(typeof raw == "object" && raw != null){
      if(raw.length > 0){
        return {uri: raw[0].filename}
      }else{
        return placeholder
      }
    }else {
      return placeholder
    }
	}

  const getDescription = (string) => {

    let ref = ""
    let shop = ""
    let content = ""

    if(string.includes("<ref>") && string.includes("<shop>")){
      ref = string.split("<ref>")[1].split("</ref>")[0]
      shop = string.split("<shop>")[1].split("</shop>")[0]
      content = string.split("</shop>")[1]
    }

    return (
      <>
        <Text>
          <Text style={styles.title}>Your order </Text>
          <Text style={styles.text}>{ref}</Text>
          <Text style={styles.title}> from </Text>
          <Text style={styles.text}>{shop}</Text>
          <Text style={styles.title}>{content}</Text>
        </Text>
        
      </>
    )
  }

  return (
  	<>
      <NewTouchableOpacity 
        onPress={() => {          
          navigation.push("ToktokMallOrderDetails", {...data, onBack: onSelect})
        }}
        style={styles.orderDetailsButton(data)}>
        <View style={styles.imageContainer}>
          <Image 
            source={getImage(data?.images)} 
            style={styles.imageStyle}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.titleText}>{orderStatus?.content?.title}</Text>
          {getDescription(orderStatus?.content?.description || "")}
        </View>
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.formText}>{DisplayDate(orderStatus?.content?.formatDate)}</Text>
          </View>
          <View>
            <Text style={styles.formText}>{orderStatus?.content?.formatTime}</Text>
          </View>
          {/* <TouchableOpacity onPress={() => {
            if(clicks == 0 && !active){
              setClicks(clicks + 1)
            }
            onSelect()
          }} style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomIcon.FeIcon name="chevron-down" size={25} color="#9E9E9E" />
          </TouchableOpacity> */}
        </View>
      </NewTouchableOpacity>
      <View style={styles.margin} />
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12, 
    color: "#9E9E9E"
  },
  text: {
    fontSize: 12, 
    color: "#F6841F"
  },
  orderDetailsButton: (data) => {
    return {
      flexDirection: 'row', 
      backgroundColor: data.read && data.read == 1 ? '#fff' : '#FFFCF4'
    }
  },
  imageContainer: {
    flex: 2, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 15
  },
  imageStyle: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    borderRadius: 5
  },
  descriptionContainer: {
    flex: 8, 
    paddingVertical: 20, 
    paddingHorizontal: 0
  },
  titleText: {
    fontSize: 13, 
    fontFamily: FONT.BOLD
  },
  formContainer: {
    flex: 2.5, 
    flexDirection:'column', 
    alignItems:'flex-end', 
    paddingVertical: 20, 
    paddingHorizontal: 15
  },
  formText: {
    color: "#9E9E9E", 
    fontSize: 10
  },
  margin: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  }
})