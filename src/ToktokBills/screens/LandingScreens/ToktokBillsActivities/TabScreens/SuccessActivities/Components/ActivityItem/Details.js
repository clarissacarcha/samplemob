import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

//HOOKS & HELPER
import { useThrottle } from 'src/hooks';
import { moderateScale, numberFormat } from 'toktokbills/helper';

//COMPONENTS
import { TransactionModal } from 'toktokbills/components';

import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;

const {width,height} = Dimensions.get("window");

export const Details = ({ item, visible, setVisible })=> {
  
  return (
    <TransactionModal visible={visible} setVisible={setVisible}>
      <View>
        <Text style={styles.labelText}>Status of toktokbils: Success</Text>
        {/* {renderDetails({details})} */}
        <Text style={styles.labelText}>Amount: PHP {numberFormat(item.amount)}</Text>
        <Text style={styles.labelText}>Amount Paid: PHP {numberFormat(item.amount)}</Text>
        <Text style={styles.labelText}>Reference No.: {item.referenceNumber}</Text>
        <Text style={styles.labelText}>toktokbills Date: {moment(item.createdAt).format("ll")}</Text>
        <Text style={styles.labelText}>toktokbills Time: {moment(item.createdAt).format("LT")}</Text>
      </View>
    </TransactionModal>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    borderBottomColor: "#F6841F",
    borderBottomWidth: 0.5,
    paddingHorizontal: moderateScale(15)
  },
  item: {
    // alignItems: "center",
    margin: 5,
    borderRadius: 5,
    padding: moderateScale(10)
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(50)
  },
  itemName: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#F6841F"
  },
  dateTime: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#929191"
  },
  amount: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#F6841F"
  },
  name: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
  },
})