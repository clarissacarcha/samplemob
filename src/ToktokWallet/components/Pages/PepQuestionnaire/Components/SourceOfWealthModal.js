import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useThrottle} from 'src/hooks';
import {LoadingIndicator, OrangeButton} from 'toktokwallet/components';
import CheckBox from 'react-native-check-box';

import CONSTANTS from 'common/res/constants';
const {MARGIN, COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;
const {width, height} = Dimensions.get('window');

const RenderItem = ({item, index, onPress}) => {
  return (
    <View underlayColor={COLOR.LIGHT} style={styles.network}>
      <TouchableOpacity
        onPress={() => onPress(index)}
        style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <CheckBox
          isChecked={item.selected}
          onClick={() => onPress(index)}
          checkBoxColor={COLOR.ORANGE}
          checkedCheckBoxColor={COLOR.ORANGE}
        />
        <View style={{flex: 1}}>
          <Text numberOfLines={2} style={styles.text}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const SourceOfWealthModal = ({visible, setVisible, loading, data, setData, doneProcess}) => {
  const onPressThrottle = useThrottle(() => {
    doneProcess();
    setVisible(false);
  }, 2000);

  const onPress = index => {
    // setVisible(false)
    const currentData = [...data];
    currentData[index] = {
      ...currentData[index],
      selected: !currentData[index].selected,
    };
    setData(currentData);
  };

  return (
    <Modal style={styles.container} visible={visible} onRequestClose={() => setVisible(false)} transparent={true}>
      <View style={styles.modalContent}>
        {loading ? (
          <View style={styles.container}>
            <LoadingIndicator isLoading={true} isFlex />
          </View>
        ) : (
          <View style={styles.networkList}>
            <FlatList
              ListHeaderComponent={() =>
                data.length == 0 &&
                !loading && (
                  <View>
                    <Text>No Available Data</Text>
                  </View>
                )
              }
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => <RenderItem onPress={onPress} index={index} item={item} />}
            />
            <View style={styles.doneButton}>
              <OrangeButton onPress={onPressThrottle} label="OK" />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkList: {
    width: width * 0.8,
    backgroundColor: 'white',
    flexGrow: 0,
    maxHeight: height * 0.7,
    borderRadius: 10,
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: COLOR.LIGHT,
    marginVertical: 8,
  },
  network: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 15,
    width: 40,
  },
  text: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginLeft: 5,
  },
  doneButton: {
    margin: 4,
    paddingTop: 15,
  },
  answerbox: {
    borderWidth: 0.5,
    borderColor: COLOR.YELLOW,
    padding: 10,
    marginRight: 10,
  },
});
