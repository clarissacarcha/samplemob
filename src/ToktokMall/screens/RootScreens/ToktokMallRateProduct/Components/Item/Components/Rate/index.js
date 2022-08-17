import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import CustomIcon from '../../../../../../../Components/Icons'

export const Rate = ({star, setRating, index}) => {
  let orange = '#FFC833'
  let gray = 'rgba(33, 37, 41, 0.1)'
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setRating({index, star: 1})}>
        <CustomIcon.FoIcon name="star" size={30} color={star >= 1 ? orange : gray} style={{paddingHorizontal: 12}} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => setRating({index, star: 2})}>
        <CustomIcon.FoIcon name="star" size={30} color={star >= 2 ? orange : gray} style={{paddingHorizontal: 12}} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => setRating({index, star: 3})}>
        <CustomIcon.FoIcon name="star" size={30} color={star >= 3 ? orange : gray} style={{paddingHorizontal: 12}} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => setRating({index, star: 4})}>
        <CustomIcon.FoIcon name="star" size={30} color={star >= 4 ? orange : gray} style={{paddingHorizontal: 12}} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => setRating({index, star: 5})}>
        <CustomIcon.FoIcon name="star" size={30} color={star >= 5 ? orange : gray} style={{paddingHorizontal: 12}} />
      </TouchableWithoutFeedback>
    </>
  )
}
