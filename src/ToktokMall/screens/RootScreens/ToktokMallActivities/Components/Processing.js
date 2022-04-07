import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  RefreshControl, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { 
  shopIcon, 
  emptyorders, 
  carIcon
} from '../../../../assets';
import { 
  getRefComAccountType, 
  Price 
} from '../../../../helpers';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_CONFIRMED_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import { Loading } from '../../../../Components';
import { Hairline } from '../../../../../components/widgets';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const walletIcon = require('../../../../assets/images/tokwaicon.png');

const Store = ({data, items}) => {
  const itemLength = items.length;

  return (
    <>
      <View style={styles.storeContainer}>
        <View style={styles.storeLeftContainer}>
          <Image source={shopIcon} style={styles.storeWalletImage} />
          <Text style={styles.storeShopName}>{data?.shopname}</Text>
        </View>
        <View style={styles.storeItemContainer}>
          <Text style={styles.storeItemText}>{itemLength > 1 ? `${itemLength} items` : `${itemLength} item`}</Text>
        </View>
      </View>
    </>
  )
}

const Summary = ({data}) => {
  return (
    <>
      <View style={styles.summaryContainer}>
        <View style={styles.summarySubContainer}>
          <Image source={walletIcon} style={styles.summaryWalletIcon} />
        </View>
        <View style={{...styles.summarySubContainer, alignItems: 'flex-end'}}>
          <Text style={styles.summaryTotalText}>Total: <Text style={{fontSize: 13, color: "#F6841F", fontWeight: '600'}}><Price amount={data?.orderTotal} /></Text></Text>
        </View>
      </View>
    </>
  )
}

export const ProcessingItem = ({fulldata, shop}) => {
  const navigation = useNavigation();
  const {
    referenceNum,
    orderPlaced,
  } = fulldata;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id})
        }}
        style={styles.renderItemButtonContainer}
      >
        <View style={styles.renderItemContainer}>
          <View style={styles.renderItemSubContainer}>
            <View style={styles.renderItemFirstContainer}>
              <View style={styles.renderItemFCRight}>
                <View style={styles.renderItemIDContainer}>
                  <Text style={styles.renderItemIDText}>
                    Oder ID
                  </Text>
                  <Text style={styles.renderItemID}>{referenceNum}</Text>
                </View>
                
                <Text style={styles.renderItemPlaced}>{orderPlaced}</Text>
              </View>
              <View style={styles.renderItemFCLeft}>
                <Image style={styles.renderItemFCLeftIcon} source={carIcon}/>
                <Text style={styles.renderItemFCLeftText}>Order confirmed</Text>
              </View>
            </View>

            <Store data={shop} items={fulldata.items[0].products[0].data} />

            <View style={styles.hairLineContainer}>
              <Hairline />
            </View>

            <Summary data={fulldata}/>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

export const Processing = ({id, email}) => {
  const [data, setData] = useState([])
  const session = useSelector(state=>state.session)

  const [getOrders, {loading, error}] = useLazyQuery(GET_CONFIRMED_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getConfirmedTransactions){
        setData(response.getConfirmedTransactions)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item}) => {
    let items = item.items || []
    return (
      <>
        {items && items.length > 0 && items.map((data) => {
          return (
            <>
              {data.products && data.products.length > 0 && data.products.map((order) => {
                return (
                  <>
                  {order.data.map((product, i) => {
                    return (
                      <>
                        <ProcessingItem 
                          dataLength={data.length} 
                          key={i} 
                          shop={data.shop}
                          data={product} 
                          fulldata={item} 
                        />
                      </>
                    )
                  })}
                  </>
                )
              })}
            </>
          )
        })}
      </>
    )
  }

  const Fetch = async () => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw)
      if(data.userId){        
        getOrders({variables: {
          input: {
            userId: data.userId,
            email: data.email,
            refCom: getRefComAccountType({session})
          }
        }})
      }
    })
  }

  useEffect(() => {    

    Fetch()
    
  }, [])

  if(loading) {
    return <Loading state={loading} />
  }

  if(!loading && data && data.length == 0){
    return (
      <>
        <View style={styles.noDataContainer}>
          <Image source={emptyorders} style={styles.noDataImage} />
          <View style={styles.noDataTextContainer}>
            <Text style={styles.noDataTitle}>No Orders</Text>
    				<Text style={styles.noDataBody}>Go browse and checkout something you like</Text>
		    	</View>
        </View>
      </>
    )
  }

  return (
    <>
      <FlatList 
        data={data}
        contentContainerStyle={styles.flatlistStyle}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl 
            refreshing={loading}
            onRefresh={() => {
              Fetch()
            }}
          />
        }
        showsVerticalScrollIndicator={false}        
      />
    </>
  );
};

const styles = StyleSheet.create({
  //Main Style
  flatlistStyle: {
    paddingVertical: 8
  },
  noDataContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  noDataImage: {
    width: '80%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  noDataTextContainer: {
    alignItems: 'center',
    marginTop: 8
  },
  noDataTitle: {
    fontSize: 18, 
    fontWeight: "600", 
    color: "#F6841F", 
    marginBottom: 8
  },
  noDataBody: {
    fontSize: 13, 
    fontWeight: "400", 
    color: "#000000"
  },

  //Render Item Style
  renderItemButtonContainer: {
    flexDirection: 'row'
  },
  renderItemContainer: {
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    flex: 1
  },
  renderItemSubContainer: {
    flex: 1, 
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#470000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
  },
  renderItemFirstContainer: {
    height: 64,
    backgroundColor: "#FFFCF4",
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flex: 1
  },
  renderItemFCRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  renderItemIDContainer: {
    flexDirection: 'row'
  },
  renderItemIDText: {
    fontWeight: "400",
    fontSize: 13
  },
  renderItemID: {
    color: "#F6841F", 
    marginLeft: 8
  },
  renderItemPlaced: {
    fontWeight: "400",
    fontSize: 11,
    color: "#525252"
  },
  renderItemFCLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  renderItemFCLeftIcon: {
    height: 14, 
    width: 16,
    marginRight: 8
  },
  renderItemFCLeftText: {
    fontSize: 13,
    fontWeight: "400"
  },
  hairLineContainer: {
    marginHorizontal: 16, 
    marginVertical: 18
  },

  //Store Style
  storeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  storeLeftContainer: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center'
  },
  storeWalletImage: {
    width: 25, 
    height: 25, 
    resizeMode: 'contain'
  },
  storeShopName: {
    fontSize: 13, 
    marginLeft: 8,
    fontWeight: "400"
  },
  storeItemContainer: {
    flex: 1, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  storeItemText: {
    fontSize: 13, 
    fontWeight: "400"
  },

  //Summary
  summaryContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    alignItems: 'center', 
    marginBottom: 16
  },
  summarySubContainer: {
    flex: 1
  },
  summaryWalletIcon: {
    width: 100, 
    height: 20, 
    resizeMode: 'contain'
  },
  summaryTotalText: {
    fontSize: 13, 
    color: "#F6841F", 
    fontWeight: '600'
  }
}) 