import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {load_logo} from 'toktokload/assets/images';
import {useThrottle} from 'src/hooks';
import {LoadingIndicator} from 'src/ToktokLoad/components';
import {VerifyContext} from '../VerifyContextProvider';
import CONSTANTS from 'common/res/constants';

//UTIL
import {moderateScale} from 'toktokload/helper';

const {MARGIN, COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;
const {width, height} = Dimensions.get('window');

const RenderItem = ({item, index, onPress}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const onPressThrottle = useThrottle(() => onPress(index), 2000);

  return (
    <TouchableHighlight onPress={onPressThrottle} underlayColor={COLOR.LIGHT} style={styles.network}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        {imageLoading && (
          <View style={{position: 'absolute', left: 10}}>
            <LoadingIndicator isLoading={true} size="small" />
          </View>
        )}
        <Image
          style={styles.image}
          source={{uri: item.iconUrl, cache: 'force-cache'}}
          resizeMode="contain"
          onLoadStart={() => {
            setImageLoading(true);
          }}
          onLoadEnd={() => {
            setImageLoading(false);
          }}
        />
        <View style={{flex: 1}}>
          <Text numberOfLines={2} style={styles.text}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export const NetworkListModal = ({
  visible,
  setVisible,
  activeNetwork,
  setActiveNetwork,
  loading,
  data,
  activeCategory,
}) => {
  const {setMobileNumber} = useContext(VerifyContext);

  const onPress = index => {
    setVisible(false);
    setActiveNetwork(data[index]);
    if (activeCategory != 'Telco') setMobileNumber('');
  };

  return (
    <Modal style={styles.container} visible={visible} onRequestClose={() => setVisible(false)} transparent={true}>
      <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => setVisible(false)}>
        <TouchableWithoutFeedback>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingIndicator isLoading={true} isFlex />
            </View>
          ) : (
            <View style={styles.networkList}>
              <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() =>
                  data.length == 0 &&
                  !loading && (
                    <View>
                      <Text>No Available Network</Text>
                    </View>
                  )
                }
                data={data}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({item, index}) => <RenderItem onPress={onPress} index={index} item={item} />}
              />
            </View>
          )}
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    // width: width * 0.8,
    // backgroundColor: 'white',
    // flexGrow: 0,
    // height: height * 0.6,
    // borderRadius: moderateScale(10),
    // padding: moderateScale(16),
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
    maxHeight: height * 0.6,
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
  },
  separator: {
    height: 1,
    backgroundColor: COLOR.LIGHT,
  },
  network: {
    paddingVertical: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: moderateScale(20),
    width: moderateScale(40),
  },
  text: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginLeft: 5,
  },
});
