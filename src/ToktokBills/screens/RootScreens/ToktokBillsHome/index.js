import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import {useIsFocused} from '@react-navigation/native';

//SELF IMPORTS
import {BillerType} from './Components';
import {HeaderBack, HeaderTitle, LoadingIndicator, Separator, SomethingWentWrong} from 'toktokbills/components';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_TYPES} from 'toktokbills/graphql/model';
import {useAccount} from 'toktokwallet/hooks';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
import {screen_bg} from 'toktokbills/assets';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokBillsHome = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktokbills']} isLogo />,
  });

  const isFocused = useIsFocused();
  const [billTypes, setBillTypes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getBillTypes, {loading, error, refetch}] = useLazyQuery(GET_BILL_TYPES, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setBillTypes([]);
    },
    onCompleted: ({getBillTypes}) => {
      setRefreshing(false);
      setBillTypes(getBillTypes);
    },
  });

  useEffect(() => {
    getBillTypes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  if (loading && billTypes.length === 0) {
    return (
      <ImageBackground source={screen_bg} style={styles.loadingContainer} resizeMode="cover">
        <LoadingIndicator isLoading={true} />
      </ImageBackground>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={screen_bg} style={{flex: 1}} resizeMode="cover">
        <View style={styles.shadowContainer}>
          <Text style={[styles.title, styles.lineSeperator]}>Select Biller Type</Text>
          <FlatList
            contentContainerStyle={styles.flatlistContainer}
            showsVerticalScrollIndicator={false}
            numColumns={4}
            data={billTypes}
            keyExtractor={item => item.name}
            renderItem={({item, index}) => <BillerType item={item} index={index} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: moderateScale(16),
  },
  flatlistContainer: {
    // paddingHorizontal: width * 0.03,
    paddingVertical: moderateScale(15),
    flexGrow: 1,
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(15),
    color: COLOR.ORANGE,
  },
  lineSeperator: {
    borderWidth: 1,
    borderColor: '#C4C4C436',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
