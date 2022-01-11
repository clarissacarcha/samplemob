import React, {useRef, useEffect, useState,} from 'react';
import {useFocusEffect} from '@react-navigation/native'
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { CHECK_ITEM_FROM_CART, GET_PRODUCT_DETAILS, GET_VERIFY_ADD_TO_CART } from '../../../../graphql/toktokmall/model';
import {View, SafeAreaView, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, Dimensions, BackHandler} from 'react-native';
import {connect, useDispatch} from 'react-redux'
import Spinner from 'react-native-spinkit';
import Toast from 'react-native-simple-toast';
import { FONT } from '../../../../res/variables';
import { Header, AdsCarousel, MessageModal, DynamicOptionModal, DynamicMessageModal, CustomModal } from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {ASAddToCart, ASClearCart, getRefComAccountType} from '../../../helpers';
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
  myCart, route, cartNoOfItems,
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
  const [variantImages, setVariantImages] = useState([])

  const [promotions, setPromotions] = useState(null)

  const [headerValue, setHeaderValue] = useState(0)
  const [scrollendreached, setscrollendreached] = useState(false)
  const [showTransparent, setshowtransparent] = useState(true)
  const dispatch = useDispatch()
  const {customModal, customMessageModal} = useSelector(state => state.toktokMall)

  const {
    params: { Id },
  } = route

  let AnimatedHeaderValue = new Animated.Value(0)
  const animatedHeaderValueRef = useRef(AnimatedHeaderValue)

  const getBottomSheetDynamicHeight = (variants) => {
    if(variants && variants.length > 0){
      return '60%'
    }else{
      return '40%'
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

  const initCartItem = () => {
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

  useEffect(() => {
    if(product){
      initCartItem()
    }
  },[product])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // navigation.pop(2)
        // alert(JSON.stringify(customModal.visible))
        if(customModal.visible || customMessageModal.visible){
          dispatch({type:'TOKTOK_MALL_CLOSE_MODAL'})
          dispatch({type:'TOKTOK_MALL_CLOSE_MESSAGE_MODAL'})
          setMessageModalShown(false)
          return true
        }
        else{
          // alert('not true')
          dispatch({type:'TOKTOK_MALL_CLOSE_MODAL'})
          dispatch({type:'TOKTOK_MALL_CLOSE_MESSAGE_MODAL'})
          setMessageModalShown(false)
          return false
        }
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  const [getProductDetails, {error, loading}] = useLazyQuery(GET_PRODUCT_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        id: Id,
        refCom: getRefComAccountType({session})
      }
    },
    onCompleted: (response) => {
      if(response.getProductDetails){
        setProduct(response.getProductDetails)
        setImages(response.getProductDetails.images)
        setStore(response.getProductDetails.shop)
        setRelevantProducts(response.getProductDetails.relevantProducts)
        setPromotions(response.getProductDetails.promotions)
        setIsFetching(false)
        if(response.getProductDetails.noOfStocks <= 0) {
          setisOutOfStock(true)
          dispatch({type:'TOKTOK_MALL_OPEN_MESSAGE_MODAL', payload: {
            action: {
              onPress:() => {
                navigation.navigate("ToktokMallHome")
                dispatch({type: "TOKTOK_MALL_CLOSE_MESSAGE_MODAL"})
              },
              title: "Back to Home."
            }
          }})
        }
        console.log("Stock", response.getProductDetails.noOfStocks)
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
      const {productId, quantity, variant, status, code, price, compareAtPrice} = getVerifyAddToCart
      verificationCallback(status, code, () => {
        setIsFetching(false)
        navigation.push("ToktokMallCheckout", {
          type: "single",
          data: [cartObject({productId: productId, qty: quantity, variation: variant, price: price, compareAtPrice: compareAtPrice})],
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
      const {productId, quantity, variant, status, code} = getVerifyAddToCart
      console.log(getVerifyAddToCart)
      verificationCallback(status, code, () => processAddToCart({Id: productId, qty: quantity, variation: variant}))
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
    if(selectedVariation != "" && variantImages){
      product.img = variantImages[0]
      product.variant = input.variation

    }else{
      product.img = images[0]
    }

    product.Id = input.productId ? input.productId : product.Id
    product.price = input.price ? input.price : product.price
    product.compareAtPrice = input.compareAtPrice ? input.compareAtPrice : product.compareAtPrice
    
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
      productid: selectedVariation != "" ? input.Id : product.Id,
      quantity: input.qty
    }
    console.log(variables)
    const req = await ApiCall("insert_cart", variables, true)

    if(req.responseData && req.responseData.success == 1){
      // createMyCartSession('push', raw)
      //setCartItems(CountCartItems)
      EventRegister.emit('refreshToktokmallShoppingCart')
      // createMyCartCountSession("add", input.qty)
      setIsFetching(false)
      initCartItem()

      dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
        type: 'Success',
        message: 'Item has been added to your cart.',
        onCloseCallback: () => {
          setMessageModalShown(true)
        }
      }})

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
    { listener: (event) => {console.log(event)}, useNativeDriver: true}
  )

  const handleHeaderScroll = (event) => {
    // const {animatedOpacity}
    console.log(event.contentOffset.y)
    const scrollPosition = event.contentOffset.y
    if( scrollPosition > 100 && ! showTransparent){
      Animated.timing(AnimatedHeaderValue, {
        toValue: 1,
      }).start(() => setshowtransparent(true))
    }
    if( scrollPosition < 100 && showTransparent){
      Animated.timing(AnimatedHeaderValue, {
        toValue: 1,
      }).start(() => setshowtransparent(false))
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 50;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

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

  const init = async () => {

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

    return () => {
      setisOutOfStock(false)
    }
  }

  useEffect(() => {
    init()
    EventRegister.emit("ToktokMallProductDetails", init)
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
      {/* {messageModalShown && 
      <CustomModal 
        type="Success"
        setIsVisible={(val) => setMessageModalShown(val)}
        message="Item has been added to your cart."
      />} */}
      
      {/* { isFetching ? <></> : <HeaderPlain animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} itemName = {route.params.itemname} /> }
      { isFetching ? <></> : <HeaderTransparent animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} /> } */}
      { headerValue >= 250 ? <HeaderPlain animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} itemName = {route.params.itemname} /> : <></>}
      { headerValue < 250 ?  <HeaderTransparent animatedValue={animatedHeaderValueRef} cartItems={cartNoOfItems} />: <></>  }
      <LoadingOverlay isVisible={isFetching} />
      
     <Animated.ScrollView
        scrollEventThrottle = {270}
        // onScroll={onScroll}
        onScroll = {({nativeEvent}) => {
          // onScroll
          // handleHeaderScroll(nativeEvent)
          setHeaderValue(nativeEvent.contentOffset.y)
          if(isCloseToBottom(nativeEvent)){
            setscrollendreached(true)
          }else{
            setscrollendreached(false)
          }
        }}
        showsVerticalScrollIndicator={false}
        // {...{onScroll}}
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
            promotion={promotions}
          />
        }

        {isFetching ? <></> :
          <RenderProduct
            data={product} 
            shop={store} 
            animatedValue = {AnimatedHeaderValue}
            onOpenVariations={() => {
              setVariationOptionType(0)
              EventRegister.emit("refreshAutoSelectVariation")
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
            isOutOfStock={isOutOfStock}
          />
        }

        {isFetching ? <></> :
          <RenderDescription 
            data={product} 
            loading = {isFetching}
          />
        }

        {isFetching ? <></> : <RenderSuggestions category={product.catId} data={relevantProducts || []} lazyload={scrollendreached} /> }
        
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
            EventRegister.emit("refreshAutoSelectVariation")
            varBottomSheetRef.current.expand()
          }}
          onPressAddToCart={() => {
            setVariationOptionType(1)
            EventRegister.emit("refreshAutoSelectVariation")
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
        initialSnapPoint={getBottomSheetDynamicHeight(product?.variations)}
        // initialSnapPoint={800}
        item={product}
        onPressAddToCart={(input) => {
          varBottomSheetRef.current.close()
          onAddToCart(input)
        }}
        onPressBuyNow={(input) => {
          varBottomSheetRef.current.close()
          onBuyNow(input)
        }}
        onSelectVariation={(value, images) => {
          setSelectedVariation(value)
          setVariantImages(images)
        }}
      />


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
              setIsFetching(false)
              setIsLoading(false)
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
                setIsFetching(false)
                setIsLoading(false)
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
                setIsFetching(false)
                setIsLoading(false)
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
    customModal: state.toktokMall.customModal
  };
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
  createMyFavorites: (action, payload) => dispatch({type: 'TOKTOK_MY_FOLLOWING', action,  payload}),
  createMyCartCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_CART_COUNT', action, payload})
});

export const ToktokMallProductDetails = connect(mapStateToProps, mapDispatchToProps)(Component);

