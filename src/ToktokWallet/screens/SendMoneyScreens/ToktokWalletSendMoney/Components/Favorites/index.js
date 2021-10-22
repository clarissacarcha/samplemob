import React, { useState , useEffect , forwardRef , useImperativeHandle , useContext } from 'react'
import {View,Text,StyleSheet,Animated,Dimensions} from 'react-native'
import {Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import {useThrottle} from 'src/hooks';
import { VectorIcon , ICON_SET } from 'src/revamp';
import { moderateScale } from 'toktokwallet/helper'
import { Separator } from 'toktokwallet/components'
import {useAlert} from 'src/hooks/useAlert'
import {FavoritesContext } from "../ContextProvider"
import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS
const {width} = Dimensions.get("window")

const renderRightActions = ({
    progress,
    dragX,
    onPress,
    item
}) => {
  
    const opacity = dragX.interpolate({
      inputRange: [-width * 0.8, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const person = `${item.favoriteAccount.person.firstName} ${item.favoriteAccount.person.lastName}`
  
    return (
      <Animated.View style={[styles.swipedRow,{opacity}]}>
        <View style={styles.swipedConfirmationContainer}>
          <Text style={styles.deleteConfirmationText}>Remove {person} from favorites?</Text>
        </View>
        <View style={[styles.deleteButton]}>
          <TouchableOpacity style={{paddingHorizontal: moderateScale(12)}} onPress={onPress}>
            <VectorIcon iconSet={ICON_SET.Feather} name="trash" color="white" size={20}/>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

const RenderItem = ({item, index , removeFromList , selectFromList})=> {
    const removeFavorite = ()=> {
      removeFromList(item)
    }
    const selectFavorite = ()=>{
      selectFromList(item)
    }
    const onPressThrottled = useThrottle(removeFavorite, 2000);
    const onPressThrottledSelect =useThrottle(selectFavorite,2000);
    const person = `${item.favoriteAccount.person.firstName} ${item.favoriteAccount.person.lastName}`
    const mobileNumber = item.favoriteAccount.mobileNumber

    return (
        <>
        <Swipeable renderRightActions={(progress,dragX)=>renderRightActions({progress,dragX,item,onPress: onPressThrottled})}>
        <TouchableOpacity onPress={onPressThrottledSelect} style={styles.favorite}>
                <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,flex:1}}>{person}</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,color: COLOR.ORANGE}}>{mobileNumber}</Text>
        </TouchableOpacity>
        </Swipeable>
        <View style={styles.separator}/>
        </>
    )
}


export const Favorites = forwardRef(({setMobileNo},ref)=> {
    const { favorites , addAccountFavorites,removeFromList, getFavorites} = useContext(FavoritesContext)
    const alert = useAlert();

    useImperativeHandle(ref, ()=> ({
        checkIfFavorites: (id)=>{

            const result = favorites.filter((data)=>{
              return data.favoriteAccount.id == id
            })
            return result.length > 0 ? true : false
         
        },
        addFavorites: (accountId)=>{
            addAccountFavorites(accountId)
        },
    }))

    const setRecipientMobileNo = (recipient) => {
      let mobile = recipient.trim()
      if(recipient.slice(0,3) == "+63"){
          mobile = recipient.replace("+63","0")
      }
      mobile = mobile.replace(/[^0-9]/g,"")
      return setMobileNo(mobile)

  }

    const selectFromList = (item)=>{
      setRecipientMobileNo(item.favoriteAccount.mobileNumber)
    }

    useEffect(()=>{
        getFavorites()
    },[])

    if(favorites.length == 0){
        return  <View style={styles.container}/>
    }

    return (
        <View style={styles.container}>           
            <View style={{flexDirection:'row',alignItems:"center",marginBottom:10}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Favorites</Text>
            </View>
            <Separator/>
             {
                 favorites.map((item,index)=>(<RenderItem selectFromList={selectFromList} removeFromList={removeFromList} item={item} index={index}/>))
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
        // backgroundColor: '#818181',
        // margin: 20,
        minHeight: 40,
      },
      swipedConfirmationContainer: {
        flex: 1,
      },
      deleteConfirmationText: {
        // color: '#fcfcfc',
       fontFamily: FONT.REGULAR,
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