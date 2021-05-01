import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, FlatList, TouchableHighlight, Image} from 'react-native';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {GET_PARTNER_BRANCHES, GET_PARTNER_BRANCH_ORDERS} from '../../../../../graphql';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {onError} from '../../../../../util';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';

const PartnerBranch = ({branch, onBranchSelect}) => {
  return (
    <TouchableHighlight
      style={{marginHorizontal: SIZE.SIDE_MARGIN, borderRadius: SIZE.BORDER_RADIUS}}
      onPress={() => {
        onBranchSelect(branch);
      }}
      underlayColor={COLOR.WHITE_UNDERLAY}>
      <View
        style={{
          height: 60,
          paddingHorizontal: 10,
          backgroundColor: 'white',
          borderRadius: SIZE.BORDER_RADIUS,
          justifyContent: 'center',
          // flexDirection: 'row',
          // alignItems: 'center',
        }}>
        {/* <Image source={{uri: branch.branchLogo}} style={{height: 50, width: 50}} resizeMode="contain" /> */}
        <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
          {branch.branchName}
        </Text>
        <Text numberOfLines={1} style={{fontFamily: FONT.REGULAR}}>
          {branch.formattedAddress}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const PartnerBranches = ({navigation, route}) => {
  const partnerRecord = route.params.partner;
  const onBranchSelect = route.params.onBranchSelect;
  const [selectedBranch, setSelectedBranch] = useState(null);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={[partnerRecord.partnerName]} />,
  });

  const {data, loading, error} = useQuery(GET_PARTNER_BRANCHES, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        partnerId: partnerRecord.id,
      },
    },
  });

  const [getPartnerBranchOrders, {loading: partnerBranchOrderLoading}] = useLazyQuery(GET_PARTNER_BRANCH_ORDERS, {
    fetchPolicy: 'no-cache',
    onError: onError,
    onCompleted: (data) => {
      onBranchSelect({
        ...selectedBranch,
        orders: data.getPartnerBranchOrders,
      });
    },
  });

  const onBranchSelectFetchOrder = (branch) => {
    setSelectedBranch(branch);
    getPartnerBranchOrders({
      variables: {
        input: {
          partnerBranchId: branch.id,
        },
      },
    });
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator color={COLOR.YELLOW} size="large" />
      </View>
    );
  }

  if (error) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      <Text>Something went wrong.</Text>
    </View>;
  }

  if (data.getPartnerBranches.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Text>No available branches.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AlertOverlay visible={partnerBranchOrderLoading} />
      <FlatList
        data={data.getPartnerBranches}
        renderItem={({item, index}) => <PartnerBranch branch={item} onBranchSelect={onBranchSelectFetchOrder} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.place_id}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomWidth: 1, marginHorizontal: 20, borderColor: COLOR.ATHENS_GRAY}} />
        )}
      />
    </View>
  );
};

export default PartnerBranches;
