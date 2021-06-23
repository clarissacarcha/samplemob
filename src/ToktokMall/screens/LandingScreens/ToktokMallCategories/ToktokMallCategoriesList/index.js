import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';

import { Dropdown } from '../../../../Components';

const testdata = [{
    category: "Accessories",
    subCategories: ["Watch"],
    imageSource: require("../../../../../assets/toktokmall-assets/images/Watch.png")
}, {
    category: "Electronics",
    subCategories: ["iPhone X", "Huawei y7Pro", "Digital TV", "Elecric Fan"],
    image: require("../../../../../assets/toktokmall-assets/images/Electronics.png")
}, {
    category: "Furnitures",
    subCategories: ["Cabinet", "Chairs", "Drawer", "Tables"],
    image: require("../../../../../assets/toktokmall-assets/images/Furniture.png")
}, {
    category: "Men's Fashion",
    subCategories: ["Jacket", "Americana", "T Shirt", "Shorts"],
    image: require("../../../../../assets/toktokmall-assets/images/Men's-Fashion.png")
}, {
    category: "Pet Care",
    subCategories: ["Dog Food", "Cat Food", "Dog Toys"],
    image: require("../../../../../assets/toktokmall-assets/images/Pet-Care.png")
}]

export const ToktokMallCategoriesList = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack hidden={true} />,
        headerTitle: () => <HeaderTitle label={['Categories', '']} />,
        headerRight: () => <HeaderRight icon="search" iconSize={18} onPress={() => navigation.navigate("ToktokMallMessageConvo")} />
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1}}>   
             
                <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
                <FlatList
                    data={testdata}
                    renderItem={({item}) => {
                        return (<Dropdown data={item} />)
                    }}
                />

            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
