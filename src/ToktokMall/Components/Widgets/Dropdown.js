import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomIcon from '../Icons';

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

    const navigation = useNavigation()

    return (
        <>
            <TouchableOpacity onPress={() => {
                onPress(data)
            }} style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14}}>{data}</Text>
                </View>
                <View style={{flex: 1}}></View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />
        </>
    )
}

const DropdownItem = ({item, onItemPress}) => {

    const [category, setCategory] = useState( item.category)
    const [content, setContent] = useState(item.subCategories) //["Cabinet", "Chairs", "Drawer"]
    const [toggle, setToggle] = useState(false)

    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                <View style={{flex: 2, borderRadius: 5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                    <Image 
                        source={item?.image || require("../../assets/images/Watch.png")} 
                        style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}} />
                </View>
                <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14}}>{category}</Text>
                </View>
                <TouchableOpacity onPress={() => setToggle(!toggle)} style={{flex: 1, justifyContent: 'center'}}>
                    <CustomIcon.FeIcon name={toggle ? "chevron-up" : "chevron-down"} size={22} color={toggle ? "#F6841F" : "#CCCCCC"} /> 
                </TouchableOpacity>
            </View>
            <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />

            {/* DROPDOWN CONTENT */}
            {toggle && content.map((item, i) => <Item data={item} onPress={(data) => onItemPress(data)} />)}

        </>
    )
}

export const Dropdown = ({data, onSelect}) => {

    const onItemPress = (data) => {
        if(onSelect){
            onSelect(data)
        }
        else{
            navigation.navigate("ToktokMallCategoriesList", {category: data})
        }
    }

    return (
        <>
		  <FlatList
            data={testdata}
            renderItem={({item}) => <DropdownItem item={item} onItemPress={onItemPress} />}
          />
        </>
    )
}