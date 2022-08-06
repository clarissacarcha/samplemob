import React, {useState, useContext, useEffect, memo, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import _ from 'lodash';

//UTILS
import {moderateScale, globeLoads, tmLoads, smartLoads} from 'toktokload/helper';
import {ErrorUtility} from 'toktokload/util';
import {VectorIcon, ICON_SET} from 'src/revamp';

//COMPONENTS
import {LoadDetails} from './LoadDetails';
import {VerifyContext} from '../VerifyContextProvider';
import {EmptyList, OrangeButton, LoadingIndicator, SearchInput, ToastModal} from 'src/ToktokLoad/components';
import {SomethingWentWrong} from 'toktokload/components';
import {SearchLoadingIndicator} from '../SearchLoadingIndicator';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {
  GET_LOAD_ITEMS,
  GET_SEARCH_LOAD_ITEMS,
  POST_FAVORITE_LOAD,
  PATCH_REMOVE_FAVORITE_LOAD,
  POST_CHECK_DISABLED_LOAD_ITEM,
} from 'toktokload/graphql/model';
import {usePrompt} from 'src/hooks';
import {stubTrue} from 'lodash';

//IMAGES
import {empty_load_item, empty_search} from 'toktokload/assets/images';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const LoadList = memo(props => {
  const {
    loadVariantId,
    navigation,
    route,
    mobileNumber,
    networkId,
    processSearch,
    getSearchLoading,
    label,
    searchLoading,
  } = props;
  const prompt = usePrompt();
  const {
    selectedLoad,
    setSelectedLoad,
    loads,
    setLoads,
    loadFavorite,
    setLoadFavorite,
    search,
    setSearch,
    hasSearch,
    setHasSearch,
    favorites,
    setFavorites,
    activeTab,
  } = useContext(VerifyContext);
  const [isMounted, setIsMounted] = useState(true);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});

  const [getLoadItems, {loading: getLoadItemsLoading, error: getLoadItemsError}] = useLazyQuery(GET_LOAD_ITEMS, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      setIsMounted(false);
    },
    onCompleted: ({getLoadItems}) => {
      setLoadFavorite(null);
      setIsMounted(false);
      setLoads(
        getLoadItems.filter(item => {
          return item.favorite == null;
        }),
      );
      setFavorites(
        getLoadItems.filter(item => {
          return item.favorite != null;
        }),
      );
    },
  });

  const [postFavoriteLoad, {loading: postFavoriteLoading, error: postFavoriteError}] = useMutation(POST_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: '',
      });
    },
    onCompleted: ({postFavoriteLoad}) => {
      if (search) {
        processSearch(search);
      } else {
        processFavorite();
      }
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
      console.log(postFavoriteLoad, 'ADD');
    },
  });

  const [patchRemoveFavoriteLoad, {loading: patchFavoriteLoading, error: patchFavoriteError}] = useMutation(
    PATCH_REMOVE_FAVORITE_LOAD,
    {
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: error => {
        ErrorUtility.StandardErrorHandling({
          error,
          navigation,
          prompt,
          title: '',
        });
      },
      onCompleted: ({patchRemoveFavoriteLoad}) => {
        if (search) {
          processSearch(search);
        } else {
          processFavorite('hasFav');
        }
        setFavoriteModal({show: true, message: 'Removed from your Favorites'});
        console.log(patchRemoveFavoriteLoad, 'REMOVE');
      },
    },
  );

  const [postCheckDisabledLoadItems, {loading: postLoading, error: postError}] = useMutation(
    POST_CHECK_DISABLED_LOAD_ITEM,
    {
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: error => {},
      onCompleted: ({postCheckDisabledLoadItems}) => {},
    },
  );

  useEffect(() => {
    if (search == '') {
      processGetLoadItems();
    }
  }, [loadVariantId]);

  useEffect(() => {
    if (search == '' && hasSearch) {
      processGetLoadItems();
    }
  }, [search, hasSearch]);

  const clearStates = () => {
    setHasSearch(false);
    setIsMounted(true);
    setLoads([]);
    setSearch('');
    setSelectedLoad({});
  };

  const processGetLoadItems = action => {
    if (!action) {
      clearStates();
    }
    postCheckDisabledLoadItems();
    getLoadItems({
      variables: {
        input: {
          loadVariantId,
          networkId,
        },
      },
    });
  };

  const onPressFavorite = (item, index) => {
    setLoadFavorite({item, index});
    let data = [...loads];
    let favData = {
      variables: {
        input: {
          loadItemId: item.id,
        },
      },
    };

    // // ADD OR REMOVE FAVORITE
    // if(item.favorite){
    //   patchRemoveFavoriteLoad(favData)
    // } else {
    //   postFavoriteLoad(favData)
    // }

    if (item.favorite) {
      patchRemoveFavoriteLoad(favData);
    } else {
      postFavoriteLoad(favData);
    }
  };

  const onPressNext = () => {
    if (Object.keys(selectedLoad).length > 0) {
      navigation.navigate('ToktokLoadSummary', {loads: selectedLoad, mobileNumber});
    }
  };

  const onPressSeeAll = () => {
    navigation.navigate('ToktokLoadFavorites', {mobileNumber, loadVariantId, processGetLoadItems});
  };

  const processFavorite = action => {
    if (action) {
      let data = {...loadFavorite.item, ['favorite']: null};
      setLoads(prev =>
        [...prev, data].sort((a, b) => {
          if (a.name === b.name) return a.amount - b.amount;
          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        }),
      );
      favorites.splice(loadFavorite.index, 1);
      setFavorites(favorites);
    } else {
      let data = {...loadFavorite.item, ['favorite']: {loadItemId: loadFavorite.item.id}};

      setFavorites(prev =>
        [...prev, data].sort((a, b) => {
          if (a.name === b.name) return a.amount - b.amount;
          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        }),
      );
      loads.splice(loadFavorite.index, 1);
      setLoads(loads);
    }
    setLoadFavorite(null);
    setSelectedLoad({});
  };

  const ListEmptyComponent = useMemo(() => {
    if (isMounted || getLoadItemsLoading) return null;

    const imageSrc = search ? empty_search : empty_load_item;
    const label = search ? 'No Results Found' : 'No Load Item';
    const message = search ? 'Try to search something similar.' : 'No load item available as of the moment.';

    return (
      <View style={styles.emptyContainer}>
        <EmptyList imageSrc={imageSrc} label={label} message={message} />
      </View>
    );
  });

  if (searchLoading) {
    return <SearchLoadingIndicator />;
  }

  if (
    isMounted ||
    (postLoading && getLoadItemsLoading && !loadFavorite && loads.length == 0) ||
    (getSearchLoading && !loadFavorite && !searchLoading)
  ) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (getLoadItemsError || postError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => processGetLoadItems()} error={getLoadItemsError ?? postError} />
      </View>
    );
  }
  return (
    <>
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} title={favoriteModal.message} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={(getLoadItemsLoading || getSearchLoading || postLoading) && !loadFavorite}
            onRefresh={() => {
              setSelectedLoad({});
              search ? processSearch(search) : processGetLoadItems('refresh');
            }}
          />
        }
        contentContainerStyle={hasSearch && loads.length === 0 && {flexGrow: 1}}>
        {/* DISPLAY FAVORITES */}
        {favorites.length > 0 && !hasSearch && (
          <>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.label}>Favorites</Text>
              {favorites.length > 3 && (
                <TouchableOpacity style={styles.seeAllContainer} onPress={onPressSeeAll}>
                  <Text style={styles.seeAllText}>See All</Text>
                  <VectorIcon color="#F6841F" size={15} iconSet={ICON_SET.Entypo} name="chevron-right" />
                </TouchableOpacity>
              )}
            </View>
            {favorites.slice(0, 3).map((item, index) => {
              return (
                <LoadDetails
                  index={index}
                  item={item}
                  onPressFavorite={() => onPressFavorite(item, index)}
                  patchFavoriteLoading={patchFavoriteLoading}
                  postFavoriteLoading={postFavoriteLoading}
                  loadFavorite={loadFavorite}
                  getLoadItemsLoading={getLoadItemsLoading}
                />
              );
            })}
          </>
        )}
        {/* DISPLAY LOADS WITHOUT FAVORITES */}
        {(loads.length > 0 || hasSearch) && (
          <>
            {loads.length > 0 && !hasSearch && favorites.length > 0 && (
              <Text style={styles.label}>{activeTab.name}</Text>
            )}
            {loads.length === 0
              ? ListEmptyComponent
              : loads.map((item, index) => {
                  return (
                    <LoadDetails
                      index={index}
                      item={item}
                      onPressFavorite={() => onPressFavorite(item, index)}
                      patchFavoriteLoading={patchFavoriteLoading}
                      postFavoriteLoading={postFavoriteLoading}
                      loadFavorite={loadFavorite}
                      getLoadItemsLoading={getLoadItemsLoading}
                    />
                  );
                })}
          </>
        )}
      </ScrollView>
      <View style={{padding: moderateScale(16)}}>
        <OrangeButton disabled={Object.keys(selectedLoad).length == 0} label="Next" onPress={() => onPressNext()} />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  label: {
    color: '#F6841F',
    fontFamily: FONT.BOLD,
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(5),
  },
  seeAllText: {
    color: '#F6841F',
    paddingHorizontal: moderateScale(5),
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
  },
});
