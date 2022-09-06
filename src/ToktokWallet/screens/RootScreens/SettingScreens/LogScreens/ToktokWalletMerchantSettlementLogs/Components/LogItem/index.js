import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {numberFormat, moderateScale, getHeaderDateTitle, currencyCode} from 'toktokwallet/helper';
import { Separator } from "toktokwallet/components";
import {useThrottle} from 'src/hooks';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

// SELF IMPORTS
import Details from './Details';

const RenderLowerText = (lowerText)=> {
  return (
      <>
      <Separator/>
      <Text style={styles.dayTitle}>{lowerText}</Text>
      </>
  )
}

export const LogItem = ({item,data,index}) => {
  const [info, setInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const displayInfo = item.node.displayInfo;
  const { upperText , lowerText } = getHeaderDateTitle({
    refDate: item?.node?.createdAt,
    data,
    index
  })
  const refNo = item.node.refNo;
  const refDateTime = moment(item.node.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const dayOfPayment = moment(item.node.createdAt).tz('Asia/Manila').format('MMM D, YYYY');
  const timeOfPayment = moment(item.node.createdAt).tz('Asia/Manila').format('hh:mm A');

  const showDetails = () => {
    setInfo({
      refNo,
      dayOfPayment,
      timeOfPayment,
      amount: displayInfo.Amount,
      name: item.node.name,
      phrase: item.node.phrase,
    });
    setOpenModal(true);
  };

  const onthrottledPress = useThrottle(showDetails, 2000);

  return (
    <>
      <Details settlement={info} visible={openModal} setVisible={setOpenModal} />
      {!!upperText && <Text style={styles.dayTitle}>{upperText}</Text>}
      <TouchableOpacity style={styles.settlement} onPress={onthrottledPress}>
        <View style={styles.settlementDetails}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>Reference # {refNo}</Text>
          <Text style={{color: '#9E9E9E', fontSize: FONT_SIZE.S, marginTop: 5, fontFamily: FONT.REGULAR}}>
            {displayInfo.Status}
          </Text>
        </View>
        <View style={styles.settlementAmount}>
          <Text style={{color: '#F6841F', fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>{displayInfo.Amount}</Text>
          <Text
            style={{
              color: '#9E9E9E',
              fontSize: FONT_SIZE.S,
              alignSelf: 'flex-end',
              marginTop: 5,
              fontFamily: FONT.REGULAR,
            }}>
            {refDateTime}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{paddingHorizontal: 16}}>
            <View style={styles.divider}/>
        </View>
        {!!lowerText && RenderLowerText(lowerText)}
    </>
  );
};

const styles = StyleSheet.create({
  settlement: {
    borderBottomWidth: 0.2,
    borderColor: 'silver',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  settlementDetails: {
    flex: 1,
  },
  settlementAmount: {
    flexBasis: 'auto',
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
  dayTitle: {
      fontFamily: FONT.BOLD,
      marginTop: moderateScale(20),
      paddingHorizontal: 16,
  },
});
