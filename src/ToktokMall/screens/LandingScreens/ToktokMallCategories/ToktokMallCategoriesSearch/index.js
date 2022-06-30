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
      <View style={{flex: 1}}>  

        <View style={styles.line} />

        {data?.getCategories && data?.getCategories.length > 0 && 
          <Dropdown 
            loading={loading} 
            data={data?.getCategories}
            onRefresh={null} 
          />
        }

        {data?.getCategories && data?.getCategories.length == 0 && 
          <>
            <View style={styles.empty}>
              <Image 
                source={emptysearch}
                style={styles.image}
              />
              <View style={{height: 20}} />
              <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchTitle}>No categories found</Text>         
              </View>
            </View>
            <View style={{flex: 0.2}} />
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
  line: {
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  empty: {
    flex: 1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  image: {
    width: '70%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  emptySearchContainer: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  emptySearchTitle: {
    fontSize: 16, 
    color: "#9E9E9E"
  }
})
