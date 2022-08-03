import React, {useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { FONT } from '../../../../../res/variables';
import { useNavigation } from '@react-navigation/native';
import { Item } from './Item';

export const Product = ({data, state, fetch, lazyload, loading2}) => {

  const [loading, setloading] = useState(state)
  const navigation = useNavigation()
  const [products, setProducts] = useState([])

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

  useEffect(() => {
    setProducts(data)
  }, [data])

    return (
      <>
        <View style={styles.container}>

            <FlatList
              data={products}
              numColumns={2}
              style={{flex: 0, paddingHorizontal: 5}}
              renderItem={({item, index}) => {
                const isEven = products?.length % 2 === 0
                if(!isEven){
                  //ODD
                  if(index == products?.length - 1){
                    return (
                      <>
                        <Item navigation={navigation} item={item} />
                        <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}></View>
                      </>
                    )
                  }                  
                }
                return <Item navigation={navigation} item={item} />
              }}
              onScroll = {({nativeEvent}) => {
                if(isCloseToBottom(nativeEvent)){
                  lazyload()
                }
              }}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return (
                  <>
                    {/* <SwipeReloader state={loading2}  /> */}
                    {loading && <ActivityIndicator animating={loading} color="#F6841F" size={28} />}
                    {/* <View style={styles.separator} /> */}
                  </>
                )
              }}
            />
            
          </View>
          <View style={{height: 15}} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingVertical: 10
  },
  heading: {
    paddingHorizontal: 15, 
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  h1: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  link: {
    fontSize: 12, 
    color: "#F6841F"
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    alignSelf: 'center', 
    borderRadius: 8
  },
  label: {
    fontSize: 11, 
    alignSelf: 'center'
  },
  separator: { 
    height: 8, 
    backgroundColor: '#F7F7FA'
  }
})