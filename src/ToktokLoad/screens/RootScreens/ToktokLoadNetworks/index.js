import React, {useContext, useEffect, useState, useCallback, useMemo} from "react";
import {View, Text, StyleSheet, Image} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, SearchInput } from "src/ToktokLoad/components";
import { LoadList, VerifyContextProvider, VerifyContext } from "./components";
import { SomethingWentWrong } from "toktokload/components";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_LOAD_VARIANTS, GET_SEARCH_LOAD_ITEMS } from 'toktokload/graphql/model'

const ErrorComponent = ({ error, onRefetch }) => {
  return (
    <View style={styles.container}>
      <SomethingWentWrong onRefetch={onRefetch} error={error} />
    </View>
  )
}

const MainComponent = ({ navigation, route }) => {
 
  const networkId = route.params?.network.id;
  const {
    setSelectedLoad,
    loads,
    setLoads,
    setLoadFavorite,
    search,
    setSearch,
    hasSearch,
    setHasSearch
  } = useContext(VerifyContext);
  const [loadVariants, setLoadVariant]= useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  const [getLoadVariants, {loading, error}] = useLazyQuery(GET_LOAD_VARIANTS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted:({ getLoadVariants })=> {
      setActiveTab(getLoadVariants[0].id);
      setLoadVariant(getLoadVariants);
    }
  });

  const [getSearchLoadItems, {loading: getSearchLoading, error: getSearchError}]  = useLazyQuery(GET_SEARCH_LOAD_ITEMS, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
    },
    onCompleted: ({ getSearchLoadItems }) => {
      setLoadFavorite(null);
      setLoads(getSearchLoadItems);
      setHasSearch(true);
    }
  });

  useEffect(() => {
    procesGetLoadVariants();
  }, [])

  const procesGetLoadVariants = () => {
    getLoadVariants({
      variables: {
        input: {
          networkId
        }
      }
    });
  }

  const onSearchChange = (value) => {
    setSearch(value);
  }

  const processSearch = useCallback(() => {
    if(search){
      setSelectedLoad({});
      getSearchLoadItems({
        variables: {
          input: {
            networkId,
            searchKey: search
          }
        }
      })
    }
  })

  const displayLoadList = () => {
    if(getSearchError) return <ErrorComponent error={getSearchError} onRefetch={() => processSearch()} />
    if(activeTab){
      return (
        <LoadList
          navigation={navigation}
          loadVariantId={activeTab}
          mobileNumber={route.params?.mobileNumber}
          networkId={networkId}
          processSearch={processSearch}
          getSearchLoading={getSearchLoading}
        />
      )
    }
    return null
  }

  if(error){
    return <ErrorComponent error={error} onRefetch={() => procesGetLoadVariants()} />
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Buy Load for</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: route.params.network.iconUrl }} resizeMode="contain" style={{ height: 15, width: 40 }} />
          <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
        </View>
      </View>
      <SearchInput
        search={search}
        onChangeText={onSearchChange}
        placeholder="Search Load Products Here"
        containerStyle={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(hasSearch ? 16 : 0) }}
        onSubmitEditing={processSearch}
        onKeyboardVisible={(val) => {
          // console.log(val)
          // setKeyboardVisible(val)
          // if(val && !search){ setLoads([]) }
        }}
      />
      { (!hasSearch && !getSearchLoading) && (
        <HeaderTabs
          tabs={loadVariants}
          scrollEnabled={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fitToScreen={false}
          loading={loading}
        />
      )}
      { displayLoadList() }
    </View>
  );
};

export const ToktokLoadNetworks = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
  });

  return (
    <VerifyContextProvider navigation={navigation}>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    alignItems: "center",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10)
  },
  headerText: {
    color: "#707070",
    fontSize: FONT_SIZE.M
  },
  mobileNo: {
    fontSize: 20
  }
})


