import React, {useRef, useState, useEffect} from 'react';
import {Text, View, FlatList, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {SearchDisplayCard} from '../../../components';

export const SearchLocation = ({title, searchResponse}) => {
  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={searchResponse}
        // keyExtractor={item => item.id}
        renderItem={({item, index}) => <SearchDisplayCard item={item} title={title} />}
      />
    </>
  );
};
