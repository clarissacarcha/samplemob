import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
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
  Animated,
} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import {useIsFocused, useRoute, useFocusEffect} from '@react-navigation/native';
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

  const fadeAnim = useRef(new Animated.Value(0));
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
      let result = getBillTypes.filter(o1 => !billTypes.some(o2 => o1.id === o2.id));
      if (result.length > 0 || getBillTypes.length != billTypes.length) {
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
        let result = getFavoriteBillsPaginate.edges.filter(o1 => !favoriteBills.some(o2 => o1.node.id === o2.node.id));

        if (result.length > 0 || getFavoriteBillsPaginate.edges.length != favoriteBills.length) {
          setFavoriteBills(getFavoriteBillsPaginate.edges);
        }
        setRefreshing(false);
      },
    },
  );

  useEffect(() => {
    if (!loading && !getFavoritesLoading && isMounted) {
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [getFavoritesLoading, loading, isMounted]);

  useFocusEffect(
    useCallback(() => {
      handleGetData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    handleGetData();
  };

  const handleGetData = async () => {
    await getBillTypes();
    await getFavoriteBillsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
    setIsMounted(true);
  };

  const ListFavoriteComponent = () => {
    const onPressSeeAll = () => {
      navigation.navigate('ToktokBillsFavorites');
    };

    if (favoriteBills.length === 0) return null;
    return (
      <Animated.View style={[styles.shadowContainer, {marginBottom: moderateScale(16), opacity: fadeAnim.current}]}>
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
          <FlatList
            data={favoriteBills.slice(0, 3)}
            renderItem={({item, index}) => <FavoriteBillerType item={item} />}
          />
        </View>
      </Animated.View>
    );
  };

  const ListBillerTypesComponent = useMemo(() => {
    if (billTypes.length === 0) return null;
    return (
      <Animated.View style={[styles.shadowContainer, {opacity: fadeAnim.current}]}>
        <Text style={[styles.title, styles.lineSeperator]}>Select Biller Type</Text>
        <View style={styles.billerTypesContainer}>
          <FlatList
            data={billTypes}
            renderItem={({item, index}) => <BillerType item={item} index={index} />}
            numColumns={4}
          />
        </View>
      </Animated.View>
    );
  }, [billTypes]);

  if (error || getFavoritesError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={handleGetData} error={error ?? getFavoritesError} />
      </View>
    );
  }
  return (
    <ImageBackground source={screen_bg} style={{flex: 1}} resizeMode="cover">
      {((loading && billTypes.length === 0) || (getFavoritesLoading && favoriteBills.length === 0 && !isMounted)) &&
      !refreshing ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LoadingIndicator isLoading={true} />
        </View>
      ) : (
        <FlatList
          extraData={[favoriteBills, billTypes]}
          contentContainerStyle={{padding: moderateScale(16)}}
          ListHeaderComponent={ListFavoriteComponent}
          ListFooterComponent={ListBillerTypesComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </ImageBackground>
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
