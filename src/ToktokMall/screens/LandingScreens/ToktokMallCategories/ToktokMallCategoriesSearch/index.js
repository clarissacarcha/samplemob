import React from 'react'
import { View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList, BackHandler} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { useQuery } from '@apollo/react-hooks'

import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_FULL_CATEGORIES } from '../../../../../graphql/toktokmall/model';

import { Header } from '../../../../Components';
import { COLOR } from '../../../../../res/variables';
import { Dropdown } from '../../../../Components';
import {emptysearch} from '../../../../assets';
import { useFocusEffect } from '@react-navigation/native'


export const ToktokMallCategoriesSearch = ({navigation})=> {

  // navigation.setOptions({
  // 	headerLeft: () => <HeaderBack hidden={true} />,
  //   headerTitle: () => <HeaderTitle label={['Categories', '']} />,
  //   headerRight: () => <HeaderRight icon="search" iconSize={18} onPress={() => navigation.navigate("ToktokMallMessageConvo")} />
  // });

  // const [getCategories, {error, loading}] = useLazyQuery(GET_FULL_CATEGORIES, {
  //   client: TOKTOK_MALL_GRAPHQL_CLIENT,
  //   fetchPolicy: 'network-only',
  //   onCompleted: async (response) => {      
			
  //   },
  //   onError: (err) => {
  //     console.log(err)
  //     setEmptySearch(true)
  //     setIsLoading(false)
  //   }
  // })

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  const {data, loading, error} = useQuery(GET_FULL_CATEGORIES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only'
  });

  return (
    <>
    <View style={styles.container}>
      <Header 
        label="Categories" 
        search={true}
        onSearch={() => {
          navigation.navigate("ToktokMallSearch", {})
        }}
      />
      <View style={styles.subContainer}>     
        <View style={styles.dropDownContainer} />
        {data?.getCategories && data?.getCategories.length > 0 && 
          <Dropdown 
            loading={loading} 
            data={data?.getCategories}
            onRefresh={null} 
          />
        }

        {data?.getCategories && data?.getCategories.length == 0 && 
          <>
          <View style={styles.emptyContainer}>
            <Image 
		  			  source={emptysearch}
	  				  style={styles.emptyImage}
  				  />
            <View style={styles.margin1} />
            <View style={styles.emptyImageContainer}>
		    			<Text style={styles.emptyTitle1}>No categories found</Text>
              <Text style={styles.emptyTitle2}></Text>              
	    			</View>
          </View>
          <View style={styles.margin2} />
          </>
        }

			</View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  subContainer: {
    flex: 1
  },
  dropDownContainer: {
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  emptyContainer: {
    flex: 1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  emptyImage: {
    width: '70%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  margin1: {
    height: 20
  },
  emptyImageContainer: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  emptyTitle1: {
    fontSize: 16, 
    color: "#9E9E9E"
  },
  emptyTitle2:{
    fontSize: 11, 
    color: "#9E9E9E"
  },
  margin2: {
    flex: 0.2
  }
})
