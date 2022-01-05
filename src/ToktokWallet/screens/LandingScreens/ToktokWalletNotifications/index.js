import React from 'react'
import { View , Text , StyleSheet , ActivityIndicator , FlatList , RefreshControl , TouchableHighlight , Image , Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { Separator, CheckIdleState , SwipeDownToRefresh , NoData} from 'toktokwallet/components'
import {GET_NOTIFICATIONS_BY_CLASSIFICATION } from 'toktokwallet/graphql'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'
import { useQuery } from '@apollo/react-hooks'
import {VectorIcon , ICON_SET } from 'src/revamp'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const imageWidth = Dimensions.get('window').width - 200;

const NotificationCard = ({message, lastItem}) => {
    const {title, body, type, payload, delivery, createdAt, classification} = message;
  
    const navigation = useNavigation();
  
    const onNotificationSelect = () => {
      
    };
  
    return (
      <TouchableHighlight onPress={onNotificationSelect} underlayColor={COLOR.WHITE_UNDERLAY} style={styles.touchable}>
        <View
          style={{
            minHeight: 70,
            justifyContent: 'center',
            backgroundColor: COLOR.WHITE,
            paddingHorizontal: SIZE.MARGIN,
            paddingVertical: SIZE.MARGIN,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{height: 70, justifyContent: 'center'}}>
              <View
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: COLOR.ORANGE,
                  borderRadius: 11,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <VectorIcon iconSet={ICON_SET.Octicons} name="mail" color={COLOR.WHITE} size={14} />
              </View>
            </View>
            <View style={{justifyContent: 'center'}}>
              <View style={{marginHorizontal: 30}}>
                <Text numberOfLines={1}>{title}</Text>
                <Text
                  style={{
                    color: COLOR.DARK,
                  }}>
                  {body}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

export const ToktokWalletNotifications = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Notifications']} />,
    })

    const session = useSelector(state=> state.session)

    const  {data,error,loading,refetch} = useQuery(GET_NOTIFICATIONS_BY_CLASSIFICATION , {
        fetchPolicy:"network-only",
        variables: {
            input: {
                userId: session.user.id,
                classification: "toktokwallet"
            }
        },
    })

    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={24} color={COLOR.YELLOW} />
                </View>
    }

    if(error){
        return <SomethingWentWrong />
    }

    if(data?.getNotificationsByClassification?.length > 0){
        return (
            <CheckIdleState>
            <Separator/>
            <SwipeDownToRefresh/>
            <View style={styles.container}>
            <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data.getNotificationsByClassification}
                    keyExtractor={(item) => item.id}
                    renderItem={({item, index}) => {
                    const lastItem = index == data.getNotificationsByClassification.length - 1 ? true : false;

                    return <NotificationCard message={item} lastItem={lastItem} />;
                    }}
                    ItemSeparatorComponent={() => (
                    <View style={{borderBottomWidth: 1, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
                    )}
                    refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
            />
            </View>
            </CheckIdleState>
        )
    }

    return (
        <CheckIdleState>
            <Separator/>
            <SwipeDownToRefresh/>
            <View style={styles.container}>
                    <FlatList
                        ListHeaderComponent={() => (
                           <NoData/>
                        )}
                        showsVerticalScrollIndicator={false}
                        data={data.getNotificationsByClassification}
                        keyExtractor={(item) => item.id}
                        renderItem={({item, index}) => null}
                        refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
                    />
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        paddingHorizontal: 16,
    },
    touchable: {
        borderRadius: 5,
        marginHorizontal: SIZE.MARGIN,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: imageWidth,
        width: imageWidth,
    },
})