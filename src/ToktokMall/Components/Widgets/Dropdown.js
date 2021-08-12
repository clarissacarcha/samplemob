import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomIcon from '../Icons';
import {placeholder} from '../../assets';

const testdata = [{
  category: "Accessories",
  subCategories: ["Watch"],
  imageSource: require("../../assets/images/Watch.png")
}, {
  category: "Electronics",
  subCategories: ["iPhone X", "Huawei y7Pro", "Digital TV", "Elecric Fan"],
  image: require("../../assets/images/Electronics.png")
}, {
  category: "Furnitures",
  subCategories: ["Cabinet", "Chairs", "Drawer", "Tables"],
  image: require("../../assets/images/Furniture.png")
}, {
  category: "Men's Fashion",
  subCategories: ["Jacket", "Americana", "T Shirt", "Shorts"],
  image: require("../../assets/images/Men's-Fashion.png")
}, {
  category: "Pet Care",
  subCategories: ["Dog Food", "Cat Food", "Dog Toys"],
  image: require("../../assets/images/Pet-Care.png")
}]

const Item = ({data, onPress}) => {

  return (
    <>
      <TouchableOpacity 
				onPress={() => { 
					onPress(data?.subCategory)
        }} 
				style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}
			>
        <View style={{flex: 1}}></View>
        <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
          <Text style={{fontSize: 14}}>{data?.subCategory}</Text>
        </View>
        <View style={{flex: 1}}></View>
      </TouchableOpacity>
      <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const DropdownItem = ({item, onItemPress}) => {

  const [category, setCategory] = useState( item.parentCategory)
  const [content, setContent] = useState(item.subCategories) //["Cabinet", "Chairs", "Drawer"]
  const [toggle, setToggle] = useState(false)

  const setIcon = () => {

    if(item?.parentIcon?.name == ""){
      //Image icon
      return (
        <>
          <Image 
            source={placeholder} 
            style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}} 
          />
        </>
      )
    }else {
      return (
        <>
          <View>
            <CustomIcon.FA5Icon name={item?.parentIcon?.name} size={22} color="#F6841F" />
          </View>
        </>
      )
    }

  }

  return (
  	<>
    	<TouchableOpacity onPress={() => setToggle(!toggle)} style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
        <View style={{flex: 2, borderRadius: 5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          {setIcon()}
        </View>
        <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
          <Text style={{fontSize: 14}}>{category}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <CustomIcon.FeIcon name={toggle ? "chevron-up" : "chevron-down"} size={22} color={toggle ? "#F6841F" : "#CCCCCC"} /> 
        </View>
      </TouchableOpacity>
    	<View style={{ height: 2, backgroundColor: '#F7F7FA'}} />

      {/* DROPDOWN CONTENT */}
      {toggle && content.map((item, i) => <Item data={item} onPress={(data) => onItemPress(data)} />)}

    </>
  )
}

export const Dropdown = ({loading = false, data, onSelect, onRefresh}) => {

  const navigation = useNavigation()

  const onItemPress = (value) => {
  	if(onSelect){
      onSelect(value)
    }else{
      navigation.navigate("ToktokMallSearch", {category: data, searchValue: value})
    }
  }

  return (
    <>
		  <FlatList
        data={data || []}
        renderItem={({item}) => <DropdownItem item={item} onItemPress={onItemPress} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#F6841F"]}
          />
        }
      />
    </>
  )
}