import React, {useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import Toast from 'react-native-simple-toast'

import {useNavigation} from '@react-navigation/native'

import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components'
import {Item} from './Components'

export const ToktokMallRateProduct = ({route}) => {
  const navigation = useNavigation()
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Rate Product']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  })

  const [dataWithRatings, setDataWithRatings] = useState(sample)

  useEffect(() => {
    if (route.params.data) {
      setDataWithRatings({
        ...route.params.data,
        rating: {
          star: 0,
          feedback: '',
          images: [],
        },
      })
    }
  }, [route])

  const setRating = ({index, star, feedback, image}) => {
    setDataWithRatings((prevState) => {
      return prevState.map((data, i) => {
        if (i === index) {
          const images = data.rating.images
          if (image) {
            if (image.action === 'add') {
              images.push(image.data)
            } else if (image.action === 'remove') {
             images.splice(image.index, 1)
            }
          }
          console.log(images)
          return {
            ...data,
            rating: {
              star: star || data.rating.star,
              feedback: feedback || data.rating.feedback,
              images: images,
            },
          }
        }
        return data
      })
    })
  }

  const onSubmit = () => {
    let ratingIsRequired = false
    dataWithRatings.map(({rating}) => {
      if (rating.star === 0) ratingIsRequired = true
    })

    if (ratingIsRequired) return Toast.show('Star rating is required!')

    route.params.openModal()
    navigation.goBack()
  }

  return (
    <FlatList
      data={dataWithRatings}
      renderItem={({item, index}) => <Item {...{...item, index, setRating}} />}
      ListFooterComponent={
        <View style={{backgroundColor: '#FFF'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#F6841F',
              alignItems: 'center',
              alignSelf: 'center',
              width: 180,
              paddingVertical: 10,
              borderRadius: 5,
              marginTop: 60,
              marginBottom: 40,
            }}
            onPress={onSubmit}>
            <Text style={{color: '#FFF', fontSize: 18, fontWeight: '100'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      }
    />
  )
}

const sample = [
  {
    label: 'Improved Copper Mask 2.0 White or Bronze',
    originalPrice: 380,
    price: 190,
    variation: 'Black',
    qty: 1,
    image: '',
    rating: {
      star: 0,
      feedback: '',
      images: [],
    },
  },
]
