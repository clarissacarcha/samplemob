import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'

import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import {GET_FULL_CATEGORIES} from '../../../../../graphql/toktokmall/model';

import { HeaderBack, HeaderTitle, HeaderRight, Header } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import { Dropdown } from '../../../../Components';
import {emptysearch} from '../../../../assets';

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
        <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
        {data?.getCategories && data?.getCategories.length > 0 && 
          <Dropdown 
            loading={loading} 
            data={data?.getCategories}
            onRefresh={null} 
          />
        }
        {data?.getCategories && data?.getCategories.length == 0 && 
          <>
          <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <Image 
		  			  source={emptysearch}
	  				  style={{width: '70%', height: Dimensions.get("screen").height / 4, resizeMode: 'contain'}}
  				  />
            <View style={{height: 20}} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
		    			<Text style={{fontSize: 16, color: "#9E9E9E"}}>No categories found</Text>
              <Text style={{fontSize: 11, color: "#9E9E9E"}}></Text>              
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
  }
})
