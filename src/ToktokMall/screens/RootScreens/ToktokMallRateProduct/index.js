import React, {useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import Toast from 'react-native-simple-toast'

import {useNavigation} from '@react-navigation/native'

import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components'
import {Item} from './Components'
import AsyncStorage from '@react-native-community/async-storage'
import { ApiCall } from '../../../helpers'
import { useSelector } from 'react-redux'

export const ToktokMallRateProduct = ({route, navigation}) => {

  const session = useSelector((state) => state.session)

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Rate Product']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  })

  const [dataWithRatings, setDataWithRatings] = useState([])

  useEffect(() => {

    if (route.params?.orderData) {

      let product = route.params?.orderData?.product

      console.log(product)

      setDataWithRatings([{
        label: product.itemname,
        originalPrice: parseFloat(product.compareAtPrice),
        price: product.price,
        variation: 'None',
        image: product.img.filename,
        qty: 1,
        rating: {
          star: 0,
          feedback: '',
          images: [],
        }
      }])

      // setDataWithRatings({
      //   label: product.itemname,
      //   originalPrice: parseFloat(product.compareAtPrice),
      //   price: product.price,
      //   variation: 'None',
      //   image: '',
      //   qty: 1,
      //   rating: {
      //     star: 0,
      //     feedback: '',
      //     images: [],
      //   },
      // })

    }

    console.log(route.params.orderData)

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

  const SubmitRating = async (rate, transaction, callback) => {

    const rawuser = await AsyncStorage.getItem("ToktokMallUser")
    const user = JSON.parse(rawuser) || {}
    const person = session?.user.person

    if(user.userId){

      const body = {
        shopid: transaction.shipping.shop.id,
        branchid: 1,
        productid: transaction.productId,
        name: `${person.firstName} ${person.lastName}`,
        email: person.emailAddress,
        rating: rate,
        reference_num: transaction.referenceNum
      }

      console.log(body)

      const req = await ApiCall("set_product_rating", body, true)

      if(req.responseData && req.responseData.success == 1){
        callback()
      }else if(req.responseError && req.responseError.success == 0){
        Toast.show(req.responseError.message, Toast.LONG)
      }else if(req.responseError){
        Toast.show("Something went wrong", Toast.LONG)
      }else if(req.responseError == null && req.responseData == null){
        Toast.show("Something went wrong", Toast.LONG)
      }
    }
  }

  const onSubmit = () => {

    let ratingIsRequired = false
    dataWithRatings.map(({rating}) => {
      if (rating.star === 0) ratingIsRequired = true
    })

    if (ratingIsRequired) return Toast.show('Star rating is required!')

    if(route.params.orderData && dataWithRatings.length > 0){

      SubmitRating(dataWithRatings[0].rating.star, route.params.orderData, () => {
        route.params.openModal()
        navigation.goBack()
      })

    }

    // route.params.openModal()
    // navigation.goBack()
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
