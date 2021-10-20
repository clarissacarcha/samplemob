import React from 'react'
import {View,Text,StyleSheet,FlatList} from 'react-native'
import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const RenderItem = ({item, index})=> {
    return (
        <>
        <View style={styles.favorite}>
                <Text>{item.name}</Text>
        </View>
        <View style={styles.separator}/>
        </>
    )
}

const sampleData = [
    {name: "a"},
    {name: "b"},
    {name: "a"},
    {name: "b"},
    {name: "a"},

]


export const Favorites = ()=> {

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',alignItems:"center",marginBottom:20}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Favorites</Text>
            </View>
             {
                 sampleData.map((item,index)=>(<RenderItem item={item} index={index}/>))
             }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 20,
        justifyContent:"flex-end"
    },
    favorite: {
        height: 20,
        backgroundColor:"white",
    },
    separator: {
        height: 2,
        backgroundColor: COLOR.LIGHT,
    }
})