import React, {useRef, useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { CHECK_ITEM_FROM_CART, GET_PRODUCT_DETAILS, GET_VERIFY_ADD_TO_CART } from '../../../../graphql/toktokmall/model';
import {View, SafeAreaView, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux'
import Spinner from 'react-native-spinkit';
import Toast from 'react-native-simple-toast';
import { FONT } from '../../../../res/variables';
import { Header, AdsCarousel, MessageModal, DynamicOptionModal, DynamicMessageModal } from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {ASAddToCart, ASClearCart} from '../../../helpers';
import ContentLoader, {InstagramLoader, FacebookLoader} from 'react-native-easy-content-loader'
import { MergeStoreProducts } from '../../../helpers';
import {useSelector} from 'react-redux';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";
import AsyncStorage from '@react-native-community/async-storage';
import { Badge, Tooltip } from 'react-native-elements';



import {

  HeaderPlain,
  HeaderTransparent,

  ProductCarousel,

  RenderDescription, 
  RenderFooter, 
  RenderProduct, 
  RenderReviews, 
  RenderStore, 
  RenderSuggestions,

  VariationBottomSheet,
  LoadingOverlay
} from './components'

import Animated, {interpolate, Extrapolate, useCode, set, greaterThan} from 'react-native-reanimated'
import { EventRegister } from 'react-native-event-listeners';

const Component =  ({
  navigation,
  createMyFavorites,
  createMyCartSession,
  createMyCartCountSession,
  myCart, route, cartNoOfItems
}) => {

  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])
  const [store, setStore] = useState({})
  const [relevantProducts, setRelevantProducts] = useState([])
  const varBottomSheetRef = useRef()
  const BuyBottomSheetRef = useRef()
  const CartBottomSheetRef = useRef()
  const [scrolling, setScrolling] = useState(false)
  const [variationOptionType, setVariationOptionType] = useState(0)
  
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [soldoutmodal, setsoldoutmodal] = useState(false)
  const [cartexceeded, setcartexceeded] = useState(false)

  const [isOutOfStock, setisOutOfStock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const [enteredQuantity, setEnteredQuantity] = useState(0)
  const [selectedVariation, setSelectedVariation] = useState('')
  const [cartItems, setCartItems] = useState(0)
  const session = useSelector(state=> state.session)
  const [user, setUser] = useState({})

  const [qtyOnCart, setQtyOnCart] = useState(0)

  const {
    params: { Id },
  } = route

  let AnimatedHeaderValue = new Animated.Value(0)
  const animatedHeaderValueRef = useRef(AnimatedHeaderValue)

  const getBottomSheetDynamicHeight = (variants) => {
    if(variants.length == 0) return 260
    else if(variants.length == 1){
      let vars = variants[0].variantList.split(",").length
      if(vars > 5){
        return '70%'
      }else if(vars < 5 && vars > 1){
        return '60%'
      }else{
        return 400
      }
    }else{
      return '60%'
    }
  }

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 50) setScrolling(true)
    else if (ypos <= 50) setScrolling(false)
  }


  const [checkItemFromCart] = useLazyQuery(CHECK_ITEM_FROM_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      console.log("CHECK_ITEM_FROM_CART", response.checkItemFromCart)
      setQtyOnCart(response.checkItemFromCart?.quantity || 0)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  
  useEffect(() => {
    if(product){
      AsyncStorage.getItem("ToktokMallUser").then((raw) => {
        const data = JSON.parse(raw)
        if(data.userId){
          checkItemFromCart({
            variables: {
              input: {
                userId: data.userId,
                productId: product.Id
              }
            }
          })
        }
      })
    }
  },[product])

  const [getProductDetails, {error, loading}] = useLazyQuery(GET_PRODUCT_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        id: Id
      }
    },
    onCompleted: (response) => {
      if(response.getProductDetails){
        setProduct(response.getProductDetails)
        setImages(response.getProductDetails.images)
        setStore(response.getProductDetails.shop)
        setRelevantProducts(response.getProductDetails.relevantProducts)
        setIsFetching(false)
        if(response.getProductDetails.noOfStocks <= 0) setisOutOfStock(true)
      }
      // console.log(response, route.params.Id)
      console.log(product)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [verifyBuyNow, {errorbuynow, loadingbuynow}] = useLazyQuery(GET_VERIFY_ADD_TO_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',   
    onCompleted: ({getVerifyAddToCart}) => {
      const {quantity, variant, status, code} = getVerifyAddToCart
      verificationCallback(status, code, () => {
        setIsFetching(false)
        navigation.push("ToktokMallCheckout", {
          type: "single",
          data: [cartObject({qty: quantity, variation: variant})],
          newCart: [],
          vouchers: [],
        })
      })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [verifyAddToCart, {erroraddcart, loadingaddcart}] = useLazyQuery(GET_VERIFY_ADD_TO_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',   
    onCompleted: ({getVerifyAddToCart}) => {
      const {quantity, variant, status, code} = getVerifyAddToCart
      verificationCallback(status, code, () => processAddToCart({qty: quantity, variation: variant}))
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const verificationCallback = async (status, code, onValid) => {   
    if(status == 1 && code == "VALID"){
    setIsFetching(true)
      onValid()
    }else if(status == 0 && code == "SOLDOUT"){
      setsoldoutmodal(true)
    }else if(status == 0 && code == "EXCEEDED"){
      setcartexceeded(true)
    }
  }

  const cartObject = (input) => {

    //for images
    product.img = images[0]

    return {
      shop: store,
      data: [[{
        amount: parseFloat(product.price * input.qty),
        id: product.Id,
        product: product,
        variation: input.variation,
        qty: input.qty,
        shopId: store.id
      }]]
    }
  }

  const onBuyNow = (input) => {

    setIsFetching(true)
    verifyBuyNow({
      variables: {
        input: {
          userId: user.userId,
          productId: Id,
          quantity: input.qty,
          variant: selectedVariation
        }
      }
    })
    
  }
  

  const onAddToCart = async (input) => {
    verifyAddToCart({
      variables: {
        input: {
          userId: user.userId,
          productId: Id,
          quantity: input.qty + qtyOnCart,
          // quantity: 200,
          variant: selectedVariation
        }
      }
    })

  }

  const processAddToCart = async (input) => {

    // let raw = cartObject(input)
    // createMyCartSession('push', raw)
    // setCartItems(CountCartItems)
    // setMessageModalShown(true)

    let variables = {
      userid: user.userId,
      shopid: store.id,
      branchid: 0,
      productid: product.Id,
      quantity: input.qty
    }
    console.log(variables)
    const req = await ApiCall("insert_cart", variables, true)

    if(req.responseData && req.responseData.success == 1){
      // createMyCartSession('push', raw)
      //setCartItems(CountCartItems)
      EventRegister.emit('refreshToktokmallShoppingCart')
      createMyCartCountSession("add", input.qty)
      setMessageModalShown(true)
      setIsFetching(false)
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
    setIsFetching(false)

  }

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
    { useNativeDriver: false}
  )

  const CountCartItems = () => {
    // return myCart.length
    let total = 0
    for(let x = 0; myCart.length > x; x++){
      total = total + myCart[x].qty
    }
    if(total > 99){
      return "99+"
    }else {
      return total
    }
  }

  useEffect(() => {

    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        setUser(data)
      }
    })

    setIsFetching(true)
    getProductDetails()
    setCartItems(CountCartItems)
    console.log('dataaaaaaaaaaaaaaa', route.params)
  }, [])  

  if(error) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Something went wrong</Text>
        </View>
      </>
    )
  }

  // if(loading) {
  //   return (
  //     <>
  //       <LoadingOverlay isVisible={loading} />
  //     </>
  //   )
  // }

  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      
      { isFetching ? <></> : <HeaderPlain animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} itemName = {route.params.itemname} /> }
      { isFetching ? <></> : <HeaderTransparent animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} /> }
      <LoadingOverlay isVisible={isFetching} />
      
     <Animated.ScrollView
        scrollEventThrottle = {270}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        {...{onScroll}}
        scrollEnabled = {!isFetching}
      >
        {/* <ContentLoader active loading = {loading} avatar aShape = {'square'} title = {false} pRows = {0}
          aSize = {250} avatarStyles = {{width: Dimensions.get('window').width, left: -10}}
        >
          <ProductCarousel 
            data={images} 
            isOutOfStock={isOutOfStock} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            loading = {isFetching}
          />
        </ContentLoader> */}
        {isFetching ? <></> :
          <ProductCarousel 
            data={images} 
            isOutOfStock={isOutOfStock} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            loading = {loading}
          />
        }

        {isFetching ? <></> :
          <RenderProduct
            data={product} 
            shop={store} 
            animatedValue = {AnimatedHeaderValue}
            onOpenVariations={() => {
              setVariationOptionType(0)
              varBottomSheetRef.current.expand()
            }}
            user = {user}
            loading = {isFetching}
          />
        }

        {isFetching ? <></> :
          <RenderStore 
            data={store} 
            loading = {isFetching}
          />
        }

        {isFetching ? <></> :
          <RenderDescription 
            data={product} 
            loading = {isFetching}
          />
        }

        {isFetching ? <></> : <RenderSuggestions data={relevantProducts || []} /> }
        
        {/* <RenderReviews /> */}
        
        <View style={{height: 60}} />
      </Animated.ScrollView>

      { isFetching ? <></> :
        <RenderFooter 
          hideBuyNow={isOutOfStock}
          onPressVisitStore={() => {
            navigation.navigate("ToktokMallStore", store)
          }}
          onPressBuyNow={() => {
            setVariationOptionType(2)
            varBottomSheetRef.current.expand()
          }}
          onPressAddToCart={() => {
            setVariationOptionType(1)
            varBottomSheetRef.current.expand()
          }}
          onPressAddToFavorites={() => {
            Toast.show("Added to favorites")
          }}
        />
      }

      <VariationBottomSheet 
        ref={varBottomSheetRef} 
        type={variationOptionType}
        initialSnapPoint={getBottomSheetDynamicHeight(product?.variantSummary || [])}
        item={product}
        image={images.length > 0 ? images[0] : {}}
        onPressAddToCart={(input) => {
          varBottomSheetRef.current.close()
          onAddToCart(input)
        }}
        onPressBuyNow={(input) => {
          varBottomSheetRef.current.close()
          onBuyNow(input)
        }}
      />

      {messageModalShown && 
      <MessageModal 
        type="Success"
        isVisible={messageModalShown}
        setIsVisible={(val) => setMessageModalShown(val)}
        message="Item has been added to your cart."
      />}

      {cartexceeded && 
      <DynamicMessageModal 
        type="Warning"
        isVisible={cartexceeded}
        setIsVisible={(val) => setcartexceeded(val)}
        title="Cart Exceeded!"
        message="We’re sorry but you reached the maximum limit 200 items in your cart."
        buttons={[
          {
            label: "OK",
            onPress: () => {
              setcartexceeded(false)
            },
            containerStyle: {
              backgroundColor: '#F6841F', 
              paddingVertical: 20,
              width: '50%',
              alignSelf: 'center'
            },
            labelStyle: {
              fontSize: 17,
              color: "#fff",
              fontFamily: FONT.BOLD
            }
          }
        ]}
      />}

      {soldoutmodal && 
        <DynamicOptionModal 
          isVisible={soldoutmodal}
          setIsVisible={(val) => setsoldoutmodal(val)}
          title={`We’re sorry but this product is <bold>SOLD OUT.</bold>`}
          description='Add this item to your favorites and we will notify you when new stocks has arrived!'
          buttons={[
            {
              label: "Back to Home",
              onPress: () => {
                navigation.pop()
              },
              containerStyle: {
                backgroundColor: 'white', 
                borderColor: "#F6841F",
              },
              labelStyle: {
                color: "#F6841F"
              }
            },
            {
              label: "Add to Favorites",
              onPress: () => {
                navigation.pop()
              },
              containerStyle: {
                backgroundColor: '#F6841F', 
                borderColor: "white",
              },
              labelStyle: {
                color: "white"
              }
            }
          ]}
        />
      }

    </SafeAreaView>
    
    </>
  );
}

const mapStateToProps = (state) => {
  let total = 0;
  state.toktokMall.myCart.map(({qty}) => total += qty)

  return {
    myCart: state.toktokMall.myCart,
    cartNoOfItems: state.toktokMall.myCartCount,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
  createMyFavorites: (action, payload) => dispatch({type: 'TOKTOK_MY_FOLLOWING', action,  payload}),
  createMyCartCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_CART_COUNT', action, payload})
});

export const ToktokMallProductDetails = connect(mapStateToProps, mapDispatchToProps)(Component);

