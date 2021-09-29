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
          <Dropdown loading={loading} data={data?.getCategories} onRefresh={null} />
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
