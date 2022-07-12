import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import FIcon from 'react-native-vector-icons/FontAwesome5';

//COMPONENTS
import {YellowButton} from 'src/revamp';
import {SearchInput, NoData} from 'toktokwallet/components';

import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const List = ({data, onChangeSelect, setVisible, hasDefault, defaultCondition}) => {
  // CHECK DISPLAY
  const checkDisplay = item => {
    if (defaultCondition === 'nationality') {
      return {
        defCon: item.nationality === 'Filipino',
        name: item.nationality,
      };
    } else if(item.name) {
      return {
        name: item.name
      }
    } else if (item.provDesc){
      return {
        name: item.provDesc
      }
    } else if (item.citymunDesc){
      return {
        name: item.citymunDesc
      }
    } else{ 
      return {
        name: item.description,
      };
    }
  };

  const renderItems = ({item, index}) => {
    const display = checkDisplay(item);
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            onChangeSelect({value: display.name, index});
            setVisible(false);
          }}
          style={[styles.content]}>
          <Text style={styles.nationalityText}>{display.name}</Text>
          {display.defCon && hasDefault && <Text style={styles.default}>(Default)</Text>}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={renderItems}
      ListEmptyComponent={() => {
        return <NoData type="search" title="No Results Found" label="Try to search something similar." />;
      }}
      contentContainerStyle={{flexGrow: 1}}
    />
  );
};
export const ListModal = ({
  visible,
  setVisible,
  data,
  onChangeSelect,
  withSearch = false,
  onSearchValue,
  hasDefault,
  defaultCondition,
}) => {
  const [search, setSearch] = useState('');

  const onChangeSearch = value => {
    onSearchValue(value);
    setSearch(value);
  };

  return (
    <Modal
      style={{margin: 0}}
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent={true}
      animationType="fade">
      <View style={styles.dateModalContent}>
        {withSearch ? (
          <View
            style={[
              styles.containerWithSearch,
              {
                paddingTop: Platform.OS === 'ios' ? getStatusbarHeight + moderateScale(15) : moderateScale(15),
              },
            ]}>
            <View style={{flexDirection: 'row', marginHorizontal: 16}}>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.center}>
                <FIcon name="chevron-left" size={16} color={COLOR.ORANGE} />
              </TouchableOpacity>
              <SearchInput
                containerStyle={styles.search}
                placeholder="Search your nationality"
                placeholderTextColor={'#525252'}
                onChangeText={onChangeSearch}
                search={search}
                onClear={() => {
                  onSearchValue('');
                  setSearch('');
                }}
              />
            </View>
            <View
              style={{
                borderRadius: moderateScale(10),
                flex: 1,
              }}>
              <List
                data={data}
                onChangeSelect={onChangeSelect}
                setVisible={setVisible}
                hasDefault={hasDefault}
                defaultCondition={defaultCondition}
              />
            </View>
          </View>
        ) : (
          <View style={styles.containerWithoutSearch}>
            <List data={data} onChangeSelect={onChangeSelect} setVisible={setVisible} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dateModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    padding: moderateScale(20),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerWithSearch: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
  },
  containerWithoutSearch: {
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '70%',
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
  },
  search: {
    marginLeft: moderateScale(16),
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  default: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#9E9E9E',
  },
  separator: {
    height: 1,
    backgroundColor: '#F4F4F4',
    marginHorizontal: moderateScale(20),
  },
});
