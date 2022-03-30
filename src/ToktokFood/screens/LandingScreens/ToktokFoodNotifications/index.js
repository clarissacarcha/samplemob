/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Image, RefreshControl, View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import styles from './styles';

import {VectorIcon, ICON_SET} from 'src/revamp';
import {COLORS} from 'src/res/constants';

// Strings
// import {notifications} from 'toktokfood/helper/strings';
import {empty_notification} from 'toktokfood/assets/images';

// Queries
import {GET_TOKTOKFOOD_NOTIFICATIONS} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const ToktokFoodNotifications = () => {
  const {customerInfo} = useSelector(state => state.toktokFood);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState([]);

  const {refetch} = useQuery(GET_TOKTOKFOOD_NOTIFICATIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: customerInfo.userId,
      },
    },
    onCompleted: ({getToktokFoodNotifications}) => {
      setNotification(getToktokFoodNotifications);
    },
  });

  useEffect(() => {
    if (isFocus) {
      refetch();
    }
  }, [isFocus]);

  const getStatus = (status, referenceNum, orderIsfor) => {
    switch (status) {
      case 'c':
        return {title: 'Cancelled Order', desc: `Order ${referenceNum} has been cancelled`};
      case 'p':
        return {title: 'Upcoming Order', desc: `Ongoing order ${referenceNum}`};
      case 'po':
        return {title: 'Preparing Order', desc: `Your order ${referenceNum} is being prepared`};
      case 'rp':
        return {title: 'Ready for Pickup', desc: `Your order ${referenceNum} is ready for pickup`};
      case 'f':
        if (orderIsfor === 1) {
          return {
            title: 'Item picked up',
            desc: `Almost there! Your order ${referenceNum} has been picked up by Rider and is on the way to you.`,
          };
        }
        return {
          title: 'Item picked up',
          desc: `Order ${referenceNum} has been picked up successfully. Thank you for ordering using toktokfood!`,
        };
      case 's':
        // console.log(status, orderIsfor, referenceNum);
        if (orderIsfor === 1) {
          return {
            title: 'Delivered',
            desc: `Order ${referenceNum} has been delivered successfully. Thank you for ordering using toktokfood!`,
          };
        }
        return {title: 'Completed Order', desc: `Order ${referenceNum} has been delivered`};
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  };

  const renderItem = ({item}) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <VectorIcon iconSet={ICON_SET.MaterialCommunity} name="email" color={COLORS.WHITE} size={15} />
      </View>
      <View style={styles.infoWrapper}>
        <View style={styles.notificationInfo}>
          <Text numberOfLines={2} style={styles.notificationTitle}>
            {getStatus(item.orderStatus, item.referenceNum, item.orderIsfor).title}
          </Text>
          <Text numberOfLines={2} style={styles.notificationContent}>
            {getStatus(item.orderStatus, item.referenceNum, item.orderIsfor).desc}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image style={styles.emptyImg} resizeMode="contain" source={empty_notification} />
      <Text style={styles.emptyText}>No notifications</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Notifications</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={notification}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={['#FFA700']}
              tintColor={COLORS.ORANGE}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </View>
  );
};

export default ToktokFoodNotifications;
