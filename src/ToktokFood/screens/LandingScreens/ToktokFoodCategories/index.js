import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import {CategoryList} from '../ToktokFoodHome/components';
import {ModalFilterSearch} from './components';

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
        <HeaderTitle showAddress={true} />
        <HeaderSearchBox />
      </HeaderImageBackground>
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
    backgroundColor: 'whitesmoke'
  },
  filterContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: {
    fontWeight: '400',
    fontSize: 13,
    marginRight: 5,
  },
});
