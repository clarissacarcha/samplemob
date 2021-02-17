import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../res/constants';
import {YellowIcon} from '../ui';

import FAIcon from 'react-native-vector-icons/FontAwesome';

const DateRated = ({dateRated}) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
      }}>
      <YellowIcon set="FontAwesome" name="calendar" size={14} />
      <View style={{width: 10}} />
      <Text style={{color: MEDIUM, flex: 1}}>{dateRated}</Text>
    </View>
  );
};

const StarRating = ({rating}) => {
  const getStarColor = index => {
    return index <= rating ? COLOR : LIGHT;
  };

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
      }}>
      <YellowIcon set="FontAwesome" name="star" size={14} />
      <View style={{width: 10}} />
      <FAIcon name="star" size={14} color={getStarColor(1)} style={{marginRight: 5}} />
      <FAIcon name="star" size={14} color={getStarColor(2)} style={{marginRight: 5}} />
      <FAIcon name="star" size={14} color={getStarColor(3)} style={{marginRight: 5}} />
      <FAIcon name="star" size={14} color={getStarColor(4)} style={{marginRight: 5}} />
      <FAIcon name="star" size={14} color={getStarColor(5)} style={{marginRight: 5}} />
    </View>
  );
};

const Feedback = ({feedback}) => {
  if (!feedback) {
    return null;
  }

  return (
    <View
      style={{
        margin: 20,
        marginTop: 0,
        flexDirection: 'row',
        paddingTop: 10,
      }}>
      <YellowIcon set="FontAwesome5" name="file-alt" size={14} />
      <View style={{width: 10}} />
      <Text style={{color: MEDIUM, flex: 1}}>{feedback}</Text>
    </View>
  );
};

export const RiderRatingCard = ({driverRating, ratingFor}) => {
  if (!driverRating) {
    return null;
  }

  const accountType = ratingFor == 'C' ? 'Customer' : 'Rider';

  return (
    <View style={[styles.cardShadow, {marginTop: 20, padding: 0}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: StyleSheet.hairlineWidth,
          padding: 20,
        }}>
        <View style={{flexDirection: 'row'}}>
          <YellowIcon set="FontAwesome" name="star" size={14} darkIcon />

          <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
            {accountType} <Text style={{color: ORANGE}}>Rating</Text>
          </Text>
        </View>
      </View>
      <DateRated dateRated={driverRating.createdAt} />
      <StarRating rating={driverRating.rating} />
      <Feedback feedback={driverRating.feedback} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    padding: 20,
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
});
