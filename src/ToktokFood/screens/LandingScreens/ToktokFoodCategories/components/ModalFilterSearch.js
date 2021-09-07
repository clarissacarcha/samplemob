import React from 'react';
import Modal from 'react-native-modal';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

// COLORS
import {COLOR, FONT_SIZE} from 'src/res/variables';
import {VectorIcon, ICON_SET} from 'src/revamp';

// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

const ModalFilterSearch = ({data, handleModal, handleSelected, selected, visible, setShowFilter}) => {

  const onPressItem = (item) => {
    handleSelected(item)
    setShowFilter(false)
  }

  // renders
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Filter Categories</Text>
      <TouchableOpacity onPress={handleModal}>
        <VectorIcon iconSet={ICON_SET.Evil} name="close" size={25} color={COLOR.DARK} />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => onPressItem(item)} style={styles.itemContainer}>
      <Text style={selected.title === item.title ? styles.itemTextSelected : styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={visible} onBackdropPress={handleModal} style={styles.modal}>
      <View style={styles.container}>
        {renderHeader()}

        <FlatList data={data} renderItem={renderItem} showsVerticalScrollIndicator={false} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: verticalScale(200),
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    borderColor: COLOR.ORANGE,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(20),
  },
  headerText: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '500',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    padding: moderateScale(20),
  },
  itemText: {
    fontSize: FONT_SIZE.L,
  },
  itemTextSelected: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default ModalFilterSearch;
