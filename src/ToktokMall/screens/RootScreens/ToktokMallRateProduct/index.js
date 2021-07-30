import React, { useState } from 'react'
import { View, TouchableWithoutFeedback, Image, Text, TextInput, TouchableOpacity, Platform } from 'react-native'

import CustomIcon from '../../../Components/Icons';
import { useNavigation } from '@react-navigation/native';

import { HeaderBack, HeaderTitle, HeaderRight } from '../../../Components';

const Rate = ({ rating, setRating, value }) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <TouchableWithoutFeedback onPress={() => setRating(value)} >
      <CustomIcon.FoIcon name="star" size={30} color={rating >= value ? orange : gray} style={{ paddingHorizontal: 12 }} />
    </TouchableWithoutFeedback>)
}

export const ToktokMallRateProduct = ({ data = sample, route }) => {
  const navigation = useNavigation()
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Rate Product']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const [rating, setRating] = useState(0)

  return <View style={{ flex: 1, marginTop: 10, backgroundColor: "#FFF" }}>
    <View style={{ flexDirection: 'row', paddingTop: 10, padding: 15, }}>
      <Image source={require("../../../assets/images/coppermask.png")} style={{ width: 55, height: 60, resizeMode: 'stretch', borderRadius: 5 }} />
      <View style={{ marginLeft: 15 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '100' }}>{data.label}</Text>
          <Text style={{ color: "#9E9E9E", fontSize: 13 }}>Variation: {data.variation}</Text>
        </View>
      </View>
    </View>
    <View style={{ height: 2, backgroundColor: '#F7F7FA' }} />

    <View style={{ alignItems: 'center', paddingTop: 40 }}>
      <Text style={{ fontSize: 16, fontWeight: '100' }}>How was your purchase</Text>
      <Text style={{ color: "#9E9E9E", fontSize: 13 }}>Kindly select a star rating</Text>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 20 }}>
      <Rate {...{ rating, setRating }} value={1} />
      <Rate {...{ rating, setRating }} value={2} />
      <Rate {...{ rating, setRating }} value={3} />
      <Rate {...{ rating, setRating }} value={4} />
      <Rate {...{ rating, setRating }} value={5} />
    </View>

    <View style={{
      minHeight: 150,
      paddingHorizontal: 15,
      paddingTop: Platform.OS === "ios" ? 15 : 0,
      marginHorizontal: 15,
      borderColor: "rgba(33, 37, 41, 0.1)",
      borderRadius: 5,
      borderWidth: 2
    }}>
      <TextInput multiline placeholder="(Write your feedback here)" />
    </View>
    <TouchableOpacity style={{
      alignItems: "center",
      marginTop: 15,
      marginHorizontal: 15,
      paddingVertical: 15,
      borderStyle: "dashed",
      borderColor: "#9E9E9E",
      borderRadius: 5,
      borderWidth: 2
    }}>
      <CustomIcon.FA5Icon name="camera" color="#9E9E9E" size={25} />
      <Text style={{ color: "#9E9E9E", fontSize: 15, paddingTop: 5 }}>Upload Photo</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        backgroundColor: "#F6841F",
        alignItems: 'center',
        alignSelf: "center",
        width: 180,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 70
      }}
      onPress={() => {
        route.params.openModal()
        navigation.goBack()
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 18, fontWeight: '100' }}>Submit</Text>
    </TouchableOpacity>
  </View>;
}

const sample = {
  label: "Improved Copper Mask 2.0 White or Bronze",
  originalPrice: 380,
  price: 190,
  variation: "Black",
  qty: 1,
  image: ""
}