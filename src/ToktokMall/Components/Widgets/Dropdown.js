import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
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
					onPress({id: data?.id, name: data?.categoryName})
        }} 
				style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}
			>
        <View style={{flex: 1}}></View>
        <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
          <Text style={{fontSize: 14}}>{data?.categoryName}</Text>
        </View>
        <View style={{flex: 1}}></View>
      </TouchableOpacity>
      <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

const DropdownItem = ({item, onItemPress, loading, active}) => {

  const [category, setCategory] = useState( item.parentCategoryName)
  const [content, setContent] = useState([]) //["Cabinet", "Chairs", "Drawer"]
  const [toggle, setToggle] = useState(false)
  useEffect(() => {
    if(active, item){
      setToggle(item.parentCategoryName === active?.parentCategoryName)
    }
  },[active, item])

  useEffect(() => {
    setContent(item.subCategories.sort((a, b) => a.categoryName.localeCompare(b.categoryName)))

    console.log(content)
  }, [])

  useEffect(() => {
    if(loading){
      console.log("test")
      setToggle(false)
    }
  },[loading])

  const setIcon = (item) => {

    return (
      <>
        <Image 
          source={item.image ? {uri: item.image} : placeholder} 
          style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}} 
        />
      </>
    )

    // if(item?.image){
    //   //Image icon
    //   return (
    //     <>
    //       <Image 
    //         source={placeholder} 
    //         style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}} 
    //       />
    //     </>
    //   )
    // }else {
    //   return (
    //     <>
    //       <View>
    //         <CustomIcon.FA5Icon name={item?.parentIcon?.name} size={22} color="#F6841F" />
    //       </View>
    //     </>
    //   )
    // }

  }

  return (
  	<>
    	<TouchableOpacity onPress={() => {
        content.length > 1 && content[0] != null && setToggle(!toggle)
        content[0] === null && onItemPress({id: item?.id, name: category})
        }} style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
        <View style={{flex: 2, borderRadius: 5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          {setIcon(item)}
        </View>
        <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
          <Text style={{fontSize: 14, color: toggle ? "#F6841F" : "#000000"}}>{category}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          {content.length > 1 && content[0] != null && <CustomIcon.FeIcon name={toggle ? "chevron-up" : "chevron-down"} size={22} color={toggle ? "#F6841F" : "#CCCCCC"} /> }
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
  const {params} = useRoute()
  console.log("params", params)
  const [refreshing, setRefreshing] = useState(false)

  const onItemPress = (value) => {
  	if(onSelect){
      onSelect(value)
    }else{
      navigation.navigate("ToktokMallSearch", {categoryId: value.id, origin: "category", searchValue: value.name})
    }
  }

  console.log(data)

  return (
    <>
		  <FlatList
        data={data || []}
        renderItem={({item}) => <DropdownItem item={item} onItemPress={onItemPress} loading={refreshing} active={params?.data} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setRefreshing(true)
              setTimeout(() => {
                setRefreshing(false)
              }, 1000);
            }}
            colors={["#F6841F"]}
          />
        }
      />
    </>
  )
}