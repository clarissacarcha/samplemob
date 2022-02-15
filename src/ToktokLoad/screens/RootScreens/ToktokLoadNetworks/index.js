import React, {useContext, useEffect, useState, useCallback, useMemo} from "react";
import {View, Text, StyleSheet} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator} from "src/ToktokLoad/components";
import { LoadList, VerifyContextProvider, VerifyContext } from "./components";
import { SomethingWentWrong } from "toktokload/components";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_NETWORKS } from 'toktokload/graphql/model'

const MainComponent = ({ navigation, route }) => {
 
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const [networks, setNetworks]= useState([]);
  const [activeTab, setActiveTab] = useState(null);

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

  const processNetworkTabs = useCallback((networkTabs) => {
    if(networkTabs && networkTabs.length > 0){
      let tabs = []
      networkTabs.map((item, index) => {
        tabs.push({
          id: item.id,
          name: item.name,
        })
      })
      setActiveTab(tabs[0].id)
      setNetworks(tabs)
    }
  })

  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => { getNetworks() }} error={error} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Buy Load for</Text>
        <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
      </View>
      <HeaderTabs
        tabs={networks}
        scrollEnabled={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fitToScreen={false}
        loading={loading}
      />
      { activeTab && (
        <LoadList
          navigation={navigation}
          networkId={activeTab}
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


