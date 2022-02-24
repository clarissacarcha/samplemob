import React, {useContext, useEffect, useState, useCallback, useMemo} from "react";
import {View, Text, StyleSheet} from "react-native";

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
import { GET_LOAD_VARIANTS } from 'toktokload/graphql/model'

const MainComponent = ({ navigation, route }) => {
 
  const { selectedLoad, setSelectedLoad, loads, setLoads, subContainerStyle, searchData, setSearchData } = useContext(VerifyContext);
  const [loadVariants, setLoadVariant]= useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [search, setSearch] = useState("");
  

  const [getLoadVariants, {loading, error}] = useLazyQuery(GET_LOAD_VARIANTS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted:({ getLoadVariants })=> {
      // processNetworkTabs(getLoadVariants);
      console.log(getLoadVariants)

      setActiveTab(getLoadVariants[0].id)
      setLoadVariant(getLoadVariants)
    }
  })

  useEffect(() => {
    getLoadVariants({
      variables: {
        input: {
          networkId: route.params.network.id
        }
      }
    });
  }, [])

  const onSearchChange = (value) => {
    setSearch(value);
    processSearch(value);
  }

  const processSearch = (value) => {
    if(value){
      const filteredContacts = loads.filter((item) => {
        let searchKey = value.toLowerCase();
        return item.name.toLowerCase().includes(searchKey) || item.amount.toString().includes(searchKey) || item.descriptions.toLowerCase().includes(searchKey)
      });
      setSearchData(filteredContacts)
    } else {
      setSearchData([]);
    }
  }

  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => { getLoadVariants() }} error={error} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Buy Load for</Text>
        <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
      </View>
      <SearchInput
        search={search}
        onChangeText={onSearchChange}
        placeholder="Search Load Products Here"
        containerStyle={{ paddingHorizontal: moderateScale(16) }}
      />
      { !search && (
        <HeaderTabs
          tabs={loadVariants}
          scrollEnabled={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fitToScreen={false}
          loading={loading}
          subContainerStyle={subContainerStyle}
        />
      )}
      { activeTab && (
        <LoadList
          navigation={navigation}
          loadVariantId={activeTab}
          mobileNumber={route.params?.mobileNumber}
        />
      )}
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


