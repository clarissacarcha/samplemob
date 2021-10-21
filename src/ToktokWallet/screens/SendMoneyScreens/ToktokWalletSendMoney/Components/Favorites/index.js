import React, { useState , useEffect , forwardRef , useImperativeHandle } from 'react'
import {View,Text,StyleSheet,Animated} from 'react-native'
import {Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import {useThrottle} from 'src/hooks';
import { VectorIcon , ICON_SET } from 'src/revamp';
import { moderateScale } from 'toktokwallet/helper'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_FAVORITES } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const renderRightActions = ({
    progress,
    dragX,
    onPress,
    item
}) => {
  
    const opacity = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  
    return (
      <Animated.View style={[styles.swipedRow,{opacity}]}>
        <View style={styles.swipedConfirmationContainer}>
          <Text style={styles.deleteConfirmationText}>Remove {item.name} from favorites?</Text>
        </View>
        <View style={[styles.deleteButton]}>
          <TouchableOpacity style={{paddingHorizontal: moderateScale(12)}} onPress={onPress}>
            <VectorIcon iconSet={ICON_SET.Feather} name="trash" color="white" size={20}/>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

const RenderItem = ({item, index})=> {
    const onPress = ()=> {
        console.log("REMOVE FROM LIST")
    }
    const onPressThrottled = useThrottle(onPress, 2000);

    return (
        <>
        <Swipeable renderRightActions={(progress,dragX)=>renderRightActions({progress,dragX,item,onPress: onPressThrottled})}>
        <TouchableOpacity onPress={()=>console.log("GG")} style={styles.favorite}>
                <Text>{item.name}</Text>
        </TouchableOpacity>
        </Swipeable>
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


export const Favorites = forwardRef(({},ref)=> {

    const [favoritesData,setFavoritesData] = useState([])
    const alert = useAlert();

    useImperativeHandle(ref, ()=> ({
        checkIfFavorites: (id)=>{
            const result = favoritesData.filter((favorite)=>favorite.id === id)
            return result.length > 0 ? true : false
        },
        refreshFavorites: getFavorites,
        addFavorites: ()=>{
            addAccountFavorites()
        }
    }))

    const addAccountFavorites = ()=>{

    }

    const [getFavorites , {loading}] = useLazyQuery(GET_FAVORITES, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getFavorites})=>{
            setFavoritesData(getFavorites)
        },  
        onError: (error)=> onErrorAlert({alert,error})
    })


    useEffect(()=>{
        getFavorites()
    },[])

    if(favoritesData.length == 0){
        return  <View style={styles.container}/>
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',alignItems:"center",marginBottom:10}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Favorites</Text>
            </View>
             {
                 sampleData.map((item,index)=>(<RenderItem item={item} index={index}/>))
             }
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 20,
        justifyContent:"flex-end"
    },
    favorite: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingLeft: 5,
        // margin: 20,
        minHeight: 40
    },
    separator: {
        height: 2,
        backgroundColor: COLOR.LIGHT,
    },
    swipedRow: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingLeft: 5,
        // backgroundColor: '#818181',
        // margin: 20,
        minHeight: 40,
      },
      swipedConfirmationContainer: {
        flex: 1,
      },
      deleteConfirmationText: {
        // color: '#fcfcfc',
       fontFamily: FONT.BOLD,
      },
      deleteButton: {
        backgroundColor: COLOR.RED,
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      },
      deleteButtonText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
        padding: 3,
      },
})