import React , {useState , useEffect} from 'react';
import {View,StyleSheet, FlatList,RefreshControl} from 'react-native';
import {useSelector} from 'react-redux'

//GRAPHQL & HOOKS
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_LOAD_TRANSACTIONS } from 'toktokload/graphql/model';
import { useAlert } from 'src/hooks';

//COMPONENTS
import { Separator, ModalPaginationLoading, CheckIdleState, SwipeDownToRefresh, NoData} from 'toktokwallet/components'
import { HeaderBack, HeaderTitle} from 'src/revamp'
import { SomethingWentWrong } from 'src/components'

//UTIL
import { onErrorAlert } from 'src/util/ErrorUtility'

//SELF IMPORTS
import { Logs } from "./Components";

import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const ToktokLoadTransactionLogs = ({navigation})=> {

  navigation.setOptions({
    headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
    headerTitle: ()=> <HeaderTitle label={['toktokload','']}/>,
  })

  const tokwaAccount = useSelector(state=>state.toktokWallet)
  const [pageIndex,setPageIndex] = useState(0)
  const [pageLoading,setPageLoading] = useState(false)
  const [records,setRecords] = useState([])
  const alert = useAlert()

  const [getTransactionLogs, {data, error, loading}] = useLazyQuery(GET_LOAD_TRANSACTIONS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    variables: {
      input: {
        type: 2
      }
    },
    onCompleted: ({ getTransactions })=> {
      console.log(getTransactions)
      setRecords(getTransactions)
    }
  })

  const Refetch = ()=> {
    getTransactionLogs()
    setPageLoading(loading)
  }

  useEffect(()=>{
    getTransactionLogs()
    setPageLoading(loading)
  },[]);

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={Refetch} />
      </View>
    )
  }

  return (
    <CheckIdleState>
      <ModalPaginationLoading visible={pageLoading}/>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => {
            if(records.length > 0) return null
            if(loading) return null
            return <NoData/>
          }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={Refetch} colors={[COLOR.YELLOW]} tintColor={COLOR.YELLOW} />}
          showsVerticalScrollIndicator={false}
          data={records}
          keyExtractor={item=>item.id}
          renderItem={({item, index})=>(
            <Logs 
              key={index} 
              item={item}
              index={index} 
              tokwaAccount={tokwaAccount}
            />
          )}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={() => {
            if(records.length === 0) return null
            if(loading) return null
            return <Separator />
          }}
        />
      </View>
    </CheckIdleState>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    padding: 16,
    flex: 1
  },
  filterType: {
    alignSelf: "flex-end",
    padding: 5, 
    paddingHorizontal: 15, 
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10
  },
  transactionLogsContainer: {
    marginVertical: 0
  },
  transaction: {
    paddingVertical: 10,
    borderBottomWidth: .2,
    borderColor:"silver",
    flexDirection: "row"
  },
  transactionIcon: {
    flexBasis: 50,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    flexBasis: "auto",
    alignItems: "flex-end"
  },
  separator: {
    backgroundColor: "#F4F4F4",
    height: 1,
  }
})
