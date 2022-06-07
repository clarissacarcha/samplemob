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
  ScrollView,
} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import _ from 'lodash';

//SELF IMPORTS
import {BillerType} from './Components';
import {FavoriteBillerType} from './Components';
import {HeaderBack, HeaderTitle, LoadingIndicator, Separator, SomethingWentWrong} from 'toktokbills/components';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_TYPES, GET_FAVORITES_BILLS_ITEMS} from 'toktokbills/graphql/model';
import {useAccount} from 'toktokwallet/hooks';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
import {screen_bg} from 'toktokbills/assets';
import {VectorIcon, ICON_SET} from 'src/revamp';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokBillsHome = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktokbills']} isLogo />,
  });
  const isFocused = useIsFocused();
  const [billTypes, setBillTypes] = useState([]);
  const [favoriteBills, setFavoriteBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [getBillTypes, {loading, error}] = useLazyQuery(GET_BILL_TYPES, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: ({getBillTypes}) => {
      const res = _.isEqual(getBillTypes.sort(), billTypes.sort());
      if (!res) {
        setBillTypes(getBillTypes);
      }
      setRefreshing(false);
    },
  });

  const [getFavoriteBillsPaginate, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(
    GET_FAVORITES_BILLS_ITEMS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: ({getFavoriteBillsPaginate}) => {
        const isEqual = _.isEqual(getFavoriteBillsPaginate.edges, favoriteBills);
        if (!isEqual) {
          setFavoriteBills(getFavoriteBillsPaginate.edges);
        }
        setRefreshing(false);
      },
    },
  );

  useEffect(() => {
    setIsMounted(true);
    handleGetData();
  }, []);

  useEffect(() => {
    if (isFocused && isMounted) {
      setRefreshing(true);
      getFavoriteBillsPaginate({
        variables: {
          input: {
            afterCursorId: null,
            afterCursorUpdatedAt: null,
          },
        },
      });
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    handleGetData();
  };

  const handleGetData = () => {
    getBillTypes();
    getFavoriteBillsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
  };

  const onPressSeeAll = () => {
    navigation.navigate('ToktokBillsFavorites', {billTypes});
  };

  if (error || getFavoritesError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error ?? getFavoritesError} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={screen_bg} style={{flex: 1}} resizeMode="cover">
        {((loading && billTypes.length === 0) || (getFavoritesLoading && favoriteBills.length === 0)) && !refreshing ? (
          <LoadingIndicator isLoading={true} isFlex />
        ) : (
          <ScrollView
            contentContainerStyle={{padding: moderateScale(16)}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {/* DISPLAY FAVORITES */}
            {favoriteBills.length > 0 && (
              <View style={styles.shadowContainer}>
                <View style={[styles.favoriteContainer, styles.lineSeperator]}>
                  <Text style={[styles.title]}>Favorite Billers</Text>
                  {favoriteBills.length > 3 && (
                    <TouchableOpacity style={styles.seeAllContainer} onPress={onPressSeeAll}>
                      <Text style={styles.seeAllText}>See All</Text>
                      <VectorIcon color={COLOR.ORANGE} size={15} iconSet={ICON_SET.Entypo} name="chevron-right" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{marginVertical: moderateScale(16)}}>
                  {favoriteBills.slice(0, 3).map((item, index) => (
                    <FavoriteBillerType item={item} index={index} billTypes={billTypes} />
                  ))}
                </View>
              </View>
            )}
            {/* DISPLAY BILLER TYPE */}
            {billTypes.length > 0 && (
              <View style={styles.shadowContainer}>
                <Text style={[styles.title, styles.lineSeperator]}>Select Biller Type</Text>
                <View style={styles.billerTypesContainer}>
                  {billTypes.map((item, index) => (
                    <BillerType item={item} index={index} />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
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
    marginBottom: moderateScale(16),
  },
  flatlistContainer: {
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
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  seeAllText: {
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  billerTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: moderateScale(20),
  },
});
