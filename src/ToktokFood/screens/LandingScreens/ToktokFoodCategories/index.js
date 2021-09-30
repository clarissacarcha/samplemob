import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import {CategoryList} from '../ToktokFoodHome/components';
import {ModalFilterSearch} from './components';
import ChangeAddress from 'toktokfood/components/ChangeAddress';

// Constants
import {searchData} from 'toktokfood/helper/strings';

const ToktokFoodCategories = () => {
  const [filterSearch, setFilterSearch] = useState(searchData[0]);
  const [showFilter, setShowFilter] = useState(false);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  const RenderFilter = () => (
    <TouchableOpacity onPress={handleFilter} style={styles.filterContainer}>
      <Text style={styles.filterText}>{filterSearch.title}</Text>
      <FIcon name="chevron-down" size={18} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle />
        <HeaderSearchBox />
      </HeaderImageBackground>
      <ChangeAddress />
      <RenderFilter />
      <CategoryList filterSearch={filterSearch} horizontal={false} />
      <ModalFilterSearch
        data={searchData}
        handleModal={handleFilter}
        handleSelected={setFilterSearch}
        selected={filterSearch}
        visible={showFilter}
        setShowFilter={setShowFilter}
      />
    </View>
  );
};

export default ToktokFoodCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  filterContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingBottom: 10,
  },
  filterText: {
    fontWeight: '400',
    fontSize: 13,
    marginRight: 5,
  },
});
