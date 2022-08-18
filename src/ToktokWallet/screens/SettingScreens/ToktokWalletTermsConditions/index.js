import React , {useRef} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image,ActivityIndicator,ScrollView} from 'react-native'
import {HeaderBack, HeaderTitle} from 'toktokwallet/components';
import { Separator, CheckIdleState } from 'toktokwallet/components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_GLOBAL_SETTING} from 'toktokwallet/graphql'
import {useQuery} from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import CONSTANTS from 'common/res/constants'
import { SomethingWentWrong } from 'src/components';
import WebView from 'react-native-webview'
import { ListContent, SectionContent } from './Components';
import { termsAndConditionsDetails, moderateScale, verticalScale } from 'toktokwallet/helper';

const { FONT_FAMILY: FONT , FONT_SIZE , MARGIN , COLOR } = CONSTANTS

export const ToktokWalletTermsConditions = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={'Terms and Conditions'} labelFont={FONT.REGULAR} headerStyle={{marginTop: 0}}/>,
    });

    return (
      <CheckIdleState>
      <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrapper}>
              {/* <Text>{data.getGlobalSetting.keyValue}</Text> */}
              <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_1} />
              <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_2} />
              <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_3} />
              <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_4} />
              <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_5} />
              <ListContent contents={termsAndConditionsDetails.DEFINITION_OF_TERMS} />
              <ListContent contents={termsAndConditionsDetails.ACCESS_TO_TOKTOKWALLET} />
              <ListContent contents={termsAndConditionsDetails.OTHER_TERMS} />
              <ListContent contents={termsAndConditionsDetails.OBLIGATIONS_OF_THE_USER}/>
              <ListContent contents={termsAndConditionsDetails.SERVICES}/>
              <ListContent contents={termsAndConditionsDetails.LIMITS}/>
              <ListContent contents={termsAndConditionsDetails.FEES_AND_OTHER_CHARGES}/>
              <SectionContent contents={termsAndConditionsDetails.TRANSACTION_HISTORY} />
              <ListContent contents={termsAndConditionsDetails.DISPUTE_AND_UNAUTHORIZED_TRANSACTIONS}/>
              <ListContent contents={termsAndConditionsDetails.ACCOUNT_DORMANCY}/>
              <ListContent contents={termsAndConditionsDetails.USERS_ACCOUNTABILITY}/>
              <ListContent contents={termsAndConditionsDetails.OBLITAGATIONS_OF_TOKTOKWALLET_CARD_HOLDER}/>
              <SectionContent contents={termsAndConditionsDetails.PIN} />
              <ListContent contents={termsAndConditionsDetails.TERMINATION_AND_SUSPENSION_OF_ACCOUNT}/>
              <ListContent contents={termsAndConditionsDetails.LIMITATION_OF_LIABILITY}/>
              <ListContent contents={termsAndConditionsDetails.CARD_LOSS_REPLACEMENT}/>
              <ListContent contents={termsAndConditionsDetails.DATA_PRIVACY_POLICY_AND_INFORMATION_COLLECTION}/>
              <ListContent contents={termsAndConditionsDetails.DATA_SHARING}/>
              <SectionContent contents={termsAndConditionsDetails.SECURITY} />
              <SectionContent contents={termsAndConditionsDetails.PUBLICITY} />
              <ListContent contents={termsAndConditionsDetails.GOVERNING_LAW} />
              <SectionContent contents={termsAndConditionsDetails.VENUE} />
              <SectionContent contents={termsAndConditionsDetails.NON_WAIVER_OF_RIGHTS} />
              <SectionContent contents={termsAndConditionsDetails.SEVERABILITY} />
              <SectionContent contents={termsAndConditionsDetails.AMENDMENT} />
              <ListContent contents={termsAndConditionsDetails.AGREEMENT}/>
              <ListContent contents={termsAndConditionsDetails.CUSTOMER_CARE}/>
            </View>
          </ScrollView>
      </View>
      </CheckIdleState>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    padding: moderateScale(16),
  },
  checkIcon: {
    height: 98,
    width: 98,
    backgroundColor: COLOR.YELLOW,
    borderRadius: 100,
    justifyContent:"center",
    alignItems:"center"
  },  
  titleText: {
    marginTop: 17,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
  actionBtn: {
    height: 70,
    padding: 16,
    justifyContent:"flex-end",
    marginBottom: Platform.OS == "ios" ? 25 : 0
  },
  body: {
    margin: 6,
    textAlign: 'justify',
  },
  contentWrapper: {
    flex: 1,
    margin: 6,
    paddingBottom: verticalScale(10),
  },
  shadow: {
    margin: 16,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: 20,
    paddingVertical: 10,
  },
})
