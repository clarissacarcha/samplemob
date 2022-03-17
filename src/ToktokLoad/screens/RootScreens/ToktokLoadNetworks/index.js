import React, {useContext, useEffect, useState, useCallback, useMemo , useRef } from "react";
import {View, Text, StyleSheet, Image} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";
import { useDebounce } from "toktokwallet/hooks";

//COMPONENTS
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, SearchInput } from "src/ToktokLoad/components";
import { LoadList, VerifyContextProvider, VerifyContext , SearchLoadingIndicator } from "./components";
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
    setHasSearch,
    activeTab,
    setActiveTab
  } = useContext(VerifyContext);
  const [loadVariants, setLoadVariant]= useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [searchLoading,setSearchLoading] = useState(false);
  
  const [getLoadVariants, {loading, error}] = useLazyQuery(GET_LOAD_VARIANTS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted:({ getLoadVariants })=> {
        if(getLoadVariants.length > 0){
          setActiveTab(getLoadVariants[0]);
          setLoadVariant(getLoadVariants);
        }
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
      setSearchLoading(false);
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
    setSearchLoading(value.length > 0)
    setSearch(value);
    debounceProcessSearch(value);
  }

  const debounceProcessSearch = useDebounce((value)=>processSearch(value) , 500);

  const processSearch = (value)=> {
    console.log("Debounce here")
    if(value != ""){
      setSelectedLoad({});
      getSearchLoadItems({
        variables: {
          input: {
            networkId,
            searchKey: value
          }
        }
      })
    }
  }

  const displayLoadList = () => {
    if(getSearchError) return <ErrorComponent error={getSearchError} onRefetch={() => processSearch()} />
    if(activeTab){
      return (
        <LoadList
          navigation={navigation}
          route={route}
          loadVariantId={activeTab?.id}
          mobileNumber={route.params?.mobileNumber}
          networkId={networkId}
          processSearch={processSearch}
          getSearchLoading={getSearchLoading}
          searchLoading={searchLoading}
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
        <View style={styles.headerContentContainer}>
          { imageLoading && (
            <View style={{ position: "absolute", left: 10 }}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{ uri: route.params.network.iconUrl }}
            style={styles.networkLogo}
            onLoadStart={() => { setImageLoading(true) }}
            onLoadEnd={() => { setImageLoading(false) }}
          />
          <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
        </View>
      </View>
      <SearchInput
        search={search}
        onChangeText={onSearchChange}
        placeholder="Search load products here!"
        containerStyle={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(hasSearch ? 16 : 0) }}
        returnKeyType="done"
        onClear={()=>setSearch("")}
        hasClear
        // onSubmitEditing={processSearch}
      />
      { (!hasSearch && !getSearchLoading && !searchLoading) && (
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
    fontSize: FONT_SIZE.L
  },
  mobileNo: {
    fontSize: moderateScale(20)
  },
  headerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(10)
  },
  networkLogo: {
    height: moderateScale(20),
    width: moderateScale(40),
    resizeMode: "contain"
  }
})


