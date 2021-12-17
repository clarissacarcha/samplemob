import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator} from "src/ToktokLoad/components";
import { LoadList, VerifyContextProvider, VerifyContext } from "./components";
import { SomethingWentWrong } from "src/components";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_NETWORKS } from 'toktokload/graphql/model'

const MainComponent = ({ navigation, route }) => {
 
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const [networks, setNetworks]= useState([]);

  const [getNetworks, {loading, error}] = useLazyQuery(GET_NETWORKS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted:({ getNetworks })=> {
      processNetworkTabs(getNetworks);
    }
  })

  useEffect(() => {
    getNetworks();
  }, [])

  const processNetworkTabs = (networkTabs) => {
    if(networkTabs && networkTabs.length > 0){
      let tabs = []
      networkTabs.map((item) => {
        tabs.push({
          name: item.name,
          screen: <LoadList navigation={navigation} networkId={item.id} mobileNumber={route.params?.mobileNumber} />
        })
      })
      setNetworks(tabs)
    }
  }
  
  if(loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => { getNetworks() }} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Buy Load For</Text>
        <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
      </View>
      { networks.length > 0 && <HeaderTabs tabs={networks} scrollEnabled={true} onTabPress={() => {}} /> }
    </View>
  );
};

export const ToktokLoadNetworks = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
  });

  return (
    <VerifyContextProvider>
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


