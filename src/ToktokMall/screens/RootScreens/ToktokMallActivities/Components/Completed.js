import React, {useState, useEffect} from 'react';
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
  HeaderTab, 
  MessageModal, 
  Loading
} from '../../../../Components';
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
import { GET_COMPLETED_TRANSACTIONS } from '../../../../../graphql/toktokmall/model';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Hairline } from '../../../../../components/widgets';
import AsyncStorage from '@react-native-community/async-storage';
import CustomIcon from '../../../../Components/Icons';

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
  );
}

export const CompletedItem = ({data, fulldata, shop}) => {
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [rated, setRated] = useState(false)
  const navigation = useNavigation()
  const {
    referenceNum,
    orderPlaced,
  } = fulldata;

  const getImageSource = (img) => {
    if(img && typeof img == "object" && img.filename != null){
      return {uri: img.filename}
    }else {
      return placeholder
    }
  }

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
                  <Text style={styles.renderItemFCLeftText}>Order delivered</Text>
                </View>
              </View>

              <Store data={shop} items={fulldata.items[0].products[0].data} />

              <View style={styles.hairLineContainer}>
                <Hairline />
              </View>

              <Summary data={fulldata}/>

              <TouchableOpacity style={styles.buyAgainButton} onPress={() => {
                navigation.navigate("ToktokMallProductDetails", {Id: data.productId})
              }} >
                <Text style={styles.buyAgainText}>Buy Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      {/* <TouchableOpacity
        activeOpacity={product?.enabled > 0 ? 0.5 : 1} 
        onPress={() => {
          if(product?.enabled == 1){
            navigation.navigate("ToktokMallOrderDetails", {...fulldata, orderId: fulldata.id})
          }
        }}
        style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 0, paddingHorizontal: 15}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
          <Image source={getImageSource(product?.image || product?.img)} style={{width: 55, height: 80, resizeMode: 'stretch', borderRadius: 5}} />
        </View>
        <View style={{flex: 8}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>{product?.name ? product?.name : product?.itemname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={product?.price} /></Text>
              </View>
              <View style={{flex: 0, paddingHorizontal: 10}}>
                <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 11}}>{parseFloat(product?.compareAtPrice) > 0 ? <Price amount={product?.compareAtPrice} /> : null}</Text>
              </View>
           </View>
            <View style={{flexDirection: 'row', paddingVertical: 5}}>
              <View style={{flex: 2.5}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {product?.variant || 'None'}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data.quantity}</Text>
              </View>
              <View style={{flex: 0.2}}></View>
            </View>
          </View>          
        </View>        
      </TouchableOpacity> */}
      
      {/* Comment this View for disabling rating */}
      {/* <View style={{flexDirection: 'row-reverse', paddingHorizontal: 15, paddingBottom: 15}}>
        {!rated && 
        <TouchableOpacity 
          onPress={()=> {                    
            navigation.navigate("ToktokMallRateProduct", {
              orderData: {...fulldata, ...data},
              openModal: () => {
                setRated(true)
                setMessageModalShown(true)
              }
            })
        }}>
          <View style={{paddingVertical: 2, paddingHorizontal: 20, backgroundColor: '#F6841F', borderRadius: 5}}>
            <Text style={{color: "#fff", fontSize: 13}}>Rate</Text>
          </View>
        </TouchableOpacity>}
        {rated && 
        // <TouchableOpacity onPress={() => {
        //   navigation.navigate("ToktokMallProductDetails", {Id: data.productId})
        // }} >
        //   <View style={{paddingVertical: 2, paddingHorizontal: 20, backgroundColor: '#F6841F', borderRadius: 5}}>
        //     <Text style={{color: "#fff", fontSize: 13}}>Buy Again</Text>
        //   </View>
        // </TouchableOpacity>}
      </View> */}

      {/* <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />

    {messageModalShown && 
      <MessageModal 
        type="Success"
        isVisible={messageModalShown}
        setIsVisible={(val) => setMessageModalShown(val)}
        message="Thank you for your response!"
      />} */}
    </>
  )
}

const Toggle = ({count, state, onPress}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 15}}>
        <Text style={{color: "#9E9E9E", fontSize: 13}}>{state ? `Hide` : `View (${count}) more items`}</Text>
        <CustomIcon.MCIcon name={state ? "chevron-up" : "chevron-down"} size={16} color="#9E9E9E" />
      </TouchableOpacity>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  )
}

export const Completed = ({id, email}) => {
  const session = useSelector(state=>state.session)
  const [toggleDrop, setToggleDrop] = useState(false)
  const [data, setData] = useState([])
  const [userId, setUserId] = useState(id)
  const [semail, setEmail] = useState(email)

  const [getOrders, {loading, error}] = useLazyQuery(GET_COMPLETED_TRANSACTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: userId || id,
        email: semail || email,
        refCom: getRefComAccountType({session})
      }
    },
    onCompleted: (response) => {
      if(response.getCompletedTransactions){
        setData(response.getCompletedTransactions)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItemx = ({item}) => {

    if(item.orderData.length > 1){

      return (
        <>
          <Store data={item?.shipping?.shop} />
          {!toggleDrop && <Item data={item.orderData[0]} fulldata={item} />}
          {toggleDrop && item.orderData.map((raw, i) => <Item key={i} data={raw} fulldata={item} />)}
          <Toggle 
            count={item.orderData.length - 1} 
            state={toggleDrop} 
            onPress={() => setToggleDrop(!toggleDrop)} 
          />
          <Summary data={item} />
        </>
      )

    }else{

      return (
        <>
          <Store data={item?.shipping?.shop} />
          {item.orderData.map((raw, i) => <Item key={i} data={raw} fulldata={item} />)}
          <Summary data={item} />
        </>
      )

    }    
    
  }

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
                        <CompletedItem
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
            // userId: 9999,
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
  buyAgainButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
    backgroundColor: "#F6841F",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buyAgainText: {
    color: "#fff", 
    fontSize: 13,
    fontWeight: "600"
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