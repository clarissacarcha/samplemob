import React, { useState, useRef, useEffect, useContext } from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import { VerifyContext } from '../components';

let scrollPosition = 0;

export const CategoryTabs = ({activeTab, setActiveTab, productCategories, loading}) => {

  const flatListRef = useRef();
  const { searchProduct } = useContext(VerifyContext);
  
  if(searchProduct) return null
  return (
    <HeaderTabs
      loading={loading}
      activeTab={activeTab}
      tabs={productCategories}
      setActiveTab={setActiveTab}
    />
  ) 
};


