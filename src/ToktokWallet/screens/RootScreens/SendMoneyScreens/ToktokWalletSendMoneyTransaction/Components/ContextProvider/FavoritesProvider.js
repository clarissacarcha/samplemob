import React, {createContext, useReducer, useState} from 'react';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_FAVORITES_PAGINATE, POST_FAVORITE_ACCOUNT, PATCH_REMOVE_FAVORITE} from 'toktokwallet/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {onErrorAlert} from 'src/util/ErrorUtility';

export const FavoritesContext = createContext();
const {Provider} = FavoritesContext;

const initialData = [];

const FavoritesProvider = ({children}) => {
  const alert = useAlert();
  const [favorites, setFavorites] = useState([]);
  const [favoriteId, setFavoriteId] = useState(0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [isFavorite, setIsFavorite] = useState(false);

  const [patchRemoveFavorite, {loading: patchFavoriteLoading}] = useMutation(PATCH_REMOVE_FAVORITE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({patchRemoveFavorite}) => {
      getFavorites();
      setFavoriteId(0);
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
      setIsFavorite(true);
    },
    onError: error => onErrorAlert({alert, error}),
  });

  const [postFavoriteAccount, {loading: postFavoriteLoading}] = useMutation(POST_FAVORITE_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postFavoriteAccount}) => {
      getFavorites();
      setFavoriteId(postFavoriteAccount.id);
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
      setIsFavorite(true);
    },
    onError: error => {
      setIsFavorite(false);
      onErrorAlert({alert, error});
    },
  });

  const [getFavoritesPaginate, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(
    GET_FAVORITES_PAGINATE,
    {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      fetchPolicy: 'no-cache',
      onCompleted: ({getFavoritesPaginate}) => {
        setFavorites(getFavoritesPaginate.edges);
        setIsFavorite(false);
      },
      onError: error => {
        setIsFavorite(false);
      },
    },
  );

  const getFavorites = () => {
    getFavoritesPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
  };

  const addAccountFavorites = accountId => {
    postFavoriteAccount({
      variables: {
        input: {
          favoriteAccountId: accountId,
        },
      },
    });
  };

  const removeFromList = id => {
    patchRemoveFavorite({
      variables: {
        input: {
          id: id.toString(),
        },
      },
    });
  };

  return (
    <Provider
      value={{
        addAccountFavorites,
        removeFromList,
        getFavorites,
        favorites,
        setFavorites,
        getFavoritesLoading,
        getFavoritesError,
        favoriteId,
        setFavoriteId,
        patchFavoriteLoading,
        postFavoriteLoading,
        favoriteModal,
        setFavoriteModal,
        isFavorite,
        setIsFavorite,
      }}>
      {children}
    </Provider>
  );
};

export default FavoritesProvider;
