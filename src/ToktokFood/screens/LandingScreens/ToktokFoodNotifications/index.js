/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Image, RefreshControl, View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';

import styles from './styles';

import {VectorIcon, ICON_SET} from 'src/revamp';
import {COLORS} from 'src/res/constants';

// Strings
import {notifications} from 'toktokfood/helper/strings';
import {empty_notification} from 'toktokfood/assets/images';

// Queries
import {GET_TOKTOKFOOD_NOTIFICATIONS} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const ToktokFoodNotifications = () => {
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState([]);

  const {refetch} = useQuery(GET_TOKTOKFOOD_NOTIFICATIONS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getToktokFoodNotifications}) => {
      setNotification(getToktokFoodNotifications);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (isFocus) {
      refetch();
    }
  }, [isFocus]);

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
            {item.title}
          </Text>
          <Text numberOfLines={2} style={styles.notificationContent}>
            {item.content}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image resizeMode="contain" source={empty_notification} />
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
