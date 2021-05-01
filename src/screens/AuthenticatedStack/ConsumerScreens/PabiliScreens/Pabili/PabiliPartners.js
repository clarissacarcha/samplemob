import React from 'react';
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONT, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {GET_PARTNERS} from '../../../../../graphql/model/Partner';
import {useQuery} from '@apollo/react-hooks';
import {GET_CASH_IN_LOGS} from '../../../../../graphql';
import Pabili from '.';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH - 80) / 3;

const Partner = ({partner, onBranchSelect}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('PartnerBranches', {partner, onBranchSelect});
      }}
      style={styles.partnerTouchable}>
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
