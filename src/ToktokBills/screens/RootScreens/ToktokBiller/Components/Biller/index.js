import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';

import {LoadingIndicator} from 'toktokbills/components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const Biller = ({item, index}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [imageLoading, setImageLoading] = useState(true);

  const onPress = () => {
    let screen = '';
    switch (item.node?.itemCode) {
      case 'SSS':
        screen = 'ToktokBillsSssTransaction';
        break;
      case 'PAG_IBIG':
        screen = 'ToktokBillsTransaction';
        break;
      default:
        screen = 'ToktokBillsTransaction';
    }
    navigation.navigate(screen, {
      billItemId: item.node.id,
      billType: route.params.billType,
      itemCode: item.node.itemCode,
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <TouchableOpacity onPress={onThrottledPress} style={styles.container}>
      <View style={styles.item}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && item.node.logo && (
            <View style={{position: 'absolute', right: 0, left: 0}}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{uri: item.node.logo}}
            style={styles.itemLogo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.itemName}>{item.node.descriptions}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    borderBottomColor: '#F8F8F8',
    borderBottomWidth: 1,
    marginHorizontal: moderateScale(16),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(10),
  },
  itemLogo: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    flexShrink: 1,
    marginLeft: moderateScale(15),
  },
});
