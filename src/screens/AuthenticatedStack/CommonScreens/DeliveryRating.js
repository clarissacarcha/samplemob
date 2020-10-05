import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import {YellowIcon} from '../../../components/ui';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../../res/constants';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {POST_CONSUMER_DELIVERY_RATING, POST_DRIVER_DELIVERY_RATING} from '../../../graphql';
import {onError} from '../../../util/ErrorUtility';

const StarRating = ({onChange}) => {
  const [rating, setRating] = useState(0);

  const onStarPress = index => {
    setRating(index);
    onChange(index);
  };

  const starColor = index => {
    if (index <= rating) {
      return COLOR;
    } else {
      return LIGHT;
    }
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
      <FAIcon onPress={() => onStarPress(1)} name="star" size={35} style={{marginRight: 15}} color={starColor(1)} />
      <FAIcon onPress={() => onStarPress(2)} name="star" size={35} style={{marginRight: 15}} color={starColor(2)} />
      <FAIcon onPress={() => onStarPress(3)} name="star" size={35} style={{marginRight: 15}} color={starColor(3)} />
      <FAIcon onPress={() => onStarPress(4)} name="star" size={35} style={{marginRight: 15}} color={starColor(4)} />
      <FAIcon onPress={() => onStarPress(5)} name="star" size={35} color={starColor(5)} />
    </View>
  );
};

const RateDelivery = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Rating']} />,
  });

  const {delivery, onDeliveryRated} = route.params;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const [postDriverDeliveryRating, {loadingDriver}] = useMutation(POST_DRIVER_DELIVERY_RATING, {
    onError: onError,
    onCompleted: ({postDriverDeliveryRating}) => {
      onDeliveryRated({
        driverRating: {
          ...postDriverDeliveryRating,
        },
      });

      navigation.pop();
    },
  });

  const [postConsumerDeliveryRating, {loadingConsumer}] = useMutation(POST_CONSUMER_DELIVERY_RATING, {
    onError: onError,
    onCompleted: ({postConsumerDeliveryRating}) => {
      onDeliveryRated({
        consumerRating: {
          ...postConsumerDeliveryRating,
        },
      });
      navigation.pop();
    },
  });

  const onSubmit = async () => {
    if (rating == 0) {
      Alert.alert('', 'Please select star rating.');
      return;
    }

    if (APP_FLAVOR === 'C') {
      // Post rating for driver
      postDriverDeliveryRating({
        variables: {
          input: {
            rating: rating,
            feedback: feedback,
            deliveryId: delivery.id,
            driverId: delivery.tokDriverId,
          },
        },
      });
    }

    if (APP_FLAVOR === 'D') {
      // Post rating for customer
      postConsumerDeliveryRating({
        variables: {
          input: {
            rating: rating,
            feedback: feedback,
            deliveryId: delivery.id,
            consumerId: delivery.tokConsumerId,
          },
        },
      });
    }
  };

  return (
    <InputScrollView contentContainerStyle={{padding: 20}}>
      {/*---------------------------------------- OVERALL RATING ----------------------------------------*/}
      <AlertOverlay visible={false} />

      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 20}}>
            <YellowIcon set="FontAwesome" name="star" size={16} darkIcon />
            <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
              {`${APP_FLAVOR === 'C' ? 'POGI' : 'Overall'}`} <Text style={{color: ORANGE}}>Rating</Text>
            </Text>
          </View>
        </View>
        <View style={{padding: 20}}>
          <StarRating onChange={value => setRating(value)} />
        </View>
      </View>

      <View style={{height: 20}} />

      {/*---------------------------------------- OVERALL RATING ----------------------------------------*/}
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 20}}>
            <YellowIcon set="FontAwesome5" name="file-alt" size={16} darkIcon />
            <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
              Share Your <Text style={{color: ORANGE}}>{`${APP_FLAVOR === 'C' ? 'POGI ' : ''}`}Experience</Text>
            </Text>
          </View>
        </View>
        <TextInput
          value={feedback}
          onChangeText={value => setFeedback(value)}
          style={{margin: 20}}
          placeholder={`Share your ${APP_FLAVOR === 'C' ? 'POGI ' : ''}experience with this delivery.`}
          placeholderTextColor={LIGHT}
          multiline
          numberOfLines={10}
          returnKeyType={'done'}
          textAlignVertical={'top'}
        />
      </View>

      <View style={{height: 20}} />

      {/*---------------------------------------- SUBMIT ----------------------------------------*/}

      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={{borderRadius: 10, marginBottom: 20}}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16}}>Submit Rating</Text>
        </View>
      </TouchableHighlight>
    </InputScrollView>
  );
};

export default RateDelivery;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submit: {
    flexDirection: 'row',
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
