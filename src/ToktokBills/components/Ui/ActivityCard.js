 import React from 'react';
 import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
 import CONSTANTS from '../../../common/res/constants';
 import {constant, throttle} from 'lodash';
 import {VectorIcon, ICON_SET} from 'src/revamp';
 
 //HELPER
 import {moderateScale, numberFormat} from 'toktokbills/helper';
 import moment from 'moment';
 
 //IMAGES & COLOR
 import {toktokwallet_logo} from 'toktokbills/assets/images';
 import {paper_airplane_icon} from 'toktokbills/assets/icons';
 import Wallet from '../../../assets/images/Wallet.png';
 import OnGoing from '../../../assets/icons/OnGoing.png';
 import ToktokWalletText from '../../../assets/images/ToktokwalletText.png';
 
 const {COLOR, FONT_SIZE, FONT_FAMILY} = CONSTANTS;
 
 const getStatus = (status) => {
   //	1 = successful; 2 = pending; 3 = failed
   switch(status){
     case 1:
       return { text: "Success", color: "#F6841F", iconName: "ios-paper-plane-outline" }
     case 3:
       return { text: "Failed", color: "#ED3A19", iconName: "close-circle-outline" }
     
     default: 
       return { text: "Pending", color: "#FDBA1C", iconName: "remove-circle-outline" }
   }
 }
 export const ActivityCard = ({item, onPress, isLastItem = false}) => {
   let {
     amount,
     convenienceFee,
     createdAt,
     destinationNumber,
     loadDetails,
     billerDetails,
     referenceNumber,
     status,
     toktokwalletReturnRefNo,
   } = item;
   let transactionDateTime = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
   let totalAmount = numberFormat(parseFloat(amount) + parseFloat(convenienceFee));
   const statusData = getStatus(status);
 
   return (
     <TouchableOpacity
       activeOpacity={0.7}
       onPress={onPress}
       style={[styles.tabContainer, {marginBottom: moderateScale(isLastItem ? 0 : 16)}]}>
       <View style={[styles.shadow]}>
         <View style={styles.detailOneContainer}>
           <View style={styles.headerContainer}>
             <Text>
               <Text style={{fontFamily: FONT_FAMILY.BOLD}}>Service Reference Number{' '}</Text>
               <Text style={{color: '#FDBA1C', fontFamily: FONT_FAMILY.BOLD}}>{referenceNumber}</Text>
             </Text>
             <Text style={styles.subText}>{transactionDateTime}</Text>
           </View>
           <View style={styles.rowAlignItemsCenter}>
             { statusData.text == 'Success' ? (
               <Image source={paper_airplane_icon} style={{ resizeMode: "contain", height: moderateScale(15), width: moderateScale(15) }} />
             ) : (
               <VectorIcon size={moderateScale(15)} iconSet={ICON_SET.Ionicon} color={statusData.color} name={statusData.iconName} />
             )}
             <Text style={[styles.statusText]}>{statusData.text}</Text>
           </View>
         </View>
         
         <View style={styles.detailTwoContainer}>
           <Image source={{uri: billerDetails?.logo}} style={styles.networkIcon} />
           <View style={{paddingLeft: moderateScale(10), flexShrink: 1}}>
             <Text>{billerDetails?.descriptions}</Text>
             <Text style={styles.subText}>{destinationNumber}</Text>
           </View>
         </View>
         <View style={styles.divider} />
         <View style={styles.detailThreeContainer}>
           <Image source={toktokwallet_logo} style={styles.toktokwalletLogo} />
           <Text style={styles.totalAmount}>Total: ₱{totalAmount}</Text>
         </View>
       </View>
     </TouchableOpacity>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   shadow: {
     backgroundColor: 'white',
     borderRadius: moderateScale(5),
     shadowColor: '#000',
 
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
   tabContainer: {
     borderRadius: moderateScale(5),
   },
   tokwaButtonTextWrapper: {
     flexDirection: 'row',
   },
   toktokText: {
     color: COLOR.YELLOW,
     fontSize: FONT_SIZE.M,
     fontFamily: FONT_FAMILY.REGULAR,
   },
   walletText: {
     color: COLOR.ORANGE,
     fontSize: FONT_SIZE.M,
     fontFamily: FONT_FAMILY.REGULAR,
   },
   detailOneContainer: {
     paddingVertical: moderateScale(10),
     paddingHorizontal: moderateScale(16),
     backgroundColor: '#FBFAE3',
     borderTopRightRadius: 5,
     borderTopLeftRadius: 5,
     flexDirection: "row",
     justifyContent: "space-between"
   },
   subText: {
     color: '#525252',
     fontSize: FONT_SIZE.S,
   },
   detailTwoContainer: {
     padding: moderateScale(16),
     flexDirection: 'row',
     alignItems: 'center',
   },
   networkIcon: {
     width: moderateScale(40),
     height: moderateScale(20),
     resizeMode: 'contain',
   },
   divider: {
     backgroundColor: '#F8F8F8',
     height: 2,
     marginHorizontal: moderateScale(16),
   },
   detailThreeContainer: {
     padding: moderateScale(16),
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
   },
   toktokwalletLogo: {
     width: moderateScale(110),
     height: moderateScale(40),
     resizeMode: 'contain',
   },
   totalAmount: {
     color: COLOR.ORANGE,
     fontSize: FONT_SIZE.M,
     fontFamily: FONT_FAMILY.BOLD,
   },
   rowAlignItemsCenter: {
     flexDirection: "row",
     alignItems: "center"
   },
   headerContainer: {
     flexShrink: 1,
     marginRight: moderateScale(10)
   },
   statusText: {
     paddingLeft: moderateScale(3)
   },
 });
 