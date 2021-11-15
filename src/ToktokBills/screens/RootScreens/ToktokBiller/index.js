import React , {useEffect, useState} from 'react'
import { View , Text , StyleSheet , Platform , FlatList, Dimensions , Image , TouchableHighlight} from 'react-native'
import { HeaderBack , HeaderTitle , Separator, SearchInput } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'
import { usePrompt , useThrottle } from 'src/hooks'
import { Biller } from "./Components"
import toktokwalletlogo from 'toktokwallet/assets/images/tokwa.png'

const sampleData = [
  {
    name: "Philippine Long Distance and Telephone",
    logo: toktokwalletlogo
  },
  {
    name: "Cable/Internet",
    logo: toktokwalletlogo
  },
  {
    name: "Cable/Internet",
    logo: toktokwalletlogo
  },
  {
    name: "Cable/Internet sfsd sdfd",
    logo: toktokwalletlogo
  },
  {
    name: "Cable/Internet",
    logo: toktokwalletlogo
  },
  {
    name: "Cable/Internet",
    logo: toktokwalletlogo
  },
]

export const ToktokBiller = ({navigation, route})=> {
  const { biller } = route.params
  const prompt = usePrompt()

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={biller.name} isRightIcon/>,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState("");

  useEffect(() => {
    if(search != ""){
      const filteredContacts = sampleData.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
      });
      setFilteredData(filteredContacts);
    } else {
      setFilteredData([])
    }
  }, [search])

  return (
    <>
    <Separator/>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput search={search} setSearch={setSearch} />
      </View>
      <FlatList
        data={filteredData.length > 0 ? filteredData : sampleData}
        renderItem={({item,index})=><Biller item={item} index={index}/>}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  },
  searchContainer: {
    padding: moderateScale(16),
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
  }
})
