import React, {useRef, useEffect, useCallback} from 'react';
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONT, SIZE} from '../../../../../res/variables';
import {GET_PARTNERS} from '../../../../../graphql/model/Partner';
import {useQuery} from '@apollo/react-hooks';
import {throttle} from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH - 80) / 3;

const Partner = ({partner, onBranchSelect}) => {
  const navigation = useNavigation();

  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressThrottled = useThrottle(() => {
    navigation.push('PartnerBranches', {partner, onBranchSelect});
  }, 1000);

  return (
    <TouchableOpacity onPress={onPressThrottled} style={styles.partnerTouchable}>
      <Image source={{uri: partner.partnerImage}} resizeMode="contain" style={styles.partnerImage} />
      <Text style={styles.partnerName}>{partner.partnerName}</Text>
    </TouchableOpacity>
  );
};

const PabiliPartners = ({orderData, setOrderData}) => {
  //#region HOOKS
  const navigation = useNavigation();
  const {data, loading, error} = useQuery(GET_PARTNERS, {
    fetchPolicy: 'network-only',
  });
  //#endregion

  //#region FUNCTIONS
  const onBranchSelect = (selectedBranch) => {
    navigation.pop();

    const updatedOrderData = {
      ...orderData,
      senderStop: {
        ...orderData.senderStop,
        name: selectedBranch.branchName,
        latitude: selectedBranch.latitude,
        longitude: selectedBranch.longitude,
        formattedAddress: selectedBranch.formattedAddress,
      },
    };

    setOrderData(updatedOrderData);

    navigation.push('PabiliDetails', {
      orderData: updatedOrderData,
      setOrderData,
      partnerBranch: selectedBranch,
    });
  };
  //#endregion

  if (loading) return null;
  if (error) return null;
  if (data.getPartners.length === 0) return null;

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Pabili Partners</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{marginHorizontal: 10}}>
        <FlatList
          data={data.getPartners}
          renderItem={({item, index}) => <Partner partner={item} onBranchSelect={onBranchSelect} />}
          numColumns={3}
        />
      </ScrollView>
    </View>
  );
};

export default PabiliPartners;

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT.BOLD,
    marginLeft: 20,
  },
  partnerTouchable: {
    alignItems: 'center',
    width: IMAGE_SIZE,
    borderRadius: SIZE.BORDER_RADIUS,
    marginHorizontal: 10,
  },
  partnerImage: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: SIZE.BORDER_RADIUS,
  },
  partnerName: {
    fontFamily: FONT.BOLD,
  },
});
