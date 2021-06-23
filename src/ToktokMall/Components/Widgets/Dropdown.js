import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import CustomIcon from '../Icons';

const Item = ({data}) => {
    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 8, justifyContent: 'center', paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14}}>{data}</Text>
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />
        </>
    )
}

export const Dropdown = ({data}) => {

    const [category, setCategory] = useState( data.category)
    const [content, setContent] = useState(data.subCategories) //["Cabinet", "Chairs", "Drawer"]
    const [toggle, setToggle] = useState(false)

    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                <View style={{flex: 2, borderRadius: 5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                    <Image 
                        source={data?.image || require("../../../assets/toktokmall-assets/images/Watch.png")} 
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
            {toggle && content.map((item, i) => <Item data={item} />)}

        </>
    )
}